# references

OTU collections (plant viruses, bee viruses, etc.). Each reference is a permission-scoped container for `otus` / `sequences` / `history` / `indexes`. Mongo is the primary store.

## Source

- Python module: `virtool/references/{db,data,models,api,oas,utils,tasks,transforms}.py`
- Pydantic models: `virtool/references/models.py` (`Reference`, `ReferenceMinimal`, `ReferenceGroup`, `ReferenceUser`, `ReferenceInstalled`, `ReferenceRelease`, `ReferenceRemotesFrom`, `ReferenceClonedFrom`)
- Mongo binding: `virtool.mongo.core.Mongo.references` → collection name `references` (plural).
- Live schema: 14 documents from production (Compass-generated JSON Schema, supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric, server-generated via `virtool.mongo.utils.get_new_id`. **Not** an ObjectId. |
| `name` | `string` | yes | User-facing display name. |
| `description` | `string` | yes | Often empty (`""`). For clones, `db.create_clone` does not set this — `data.create` writes the request value directly. |
| `data_type` | `string` | yes | `"genome"` or `"barcode"` (`ReferenceDataType` enum). All prod docs are `"genome"`. |
| `organism` | `string` | yes | User-defined. Case is **inconsistent** in prod (`"virus"` vs `"Virus"`); the storage layer does not normalise. |
| `created_at` | `Date` | yes | UTC. |
| `restrict_source_types` | `boolean` | yes | When true, OTU isolates may only use values from `source_types`. |
| `source_types` | `string[]` | yes | Default from `Settings.default_source_types` (typically `["isolate", "strain"]`). |
| `task` | `{ id: int } \| null` | yes | Reference to the create/clone/import/remote task. `null` on docs predating the task system (2/14 in prod). |
| `user` | `{ id: int }` | yes | Creator. `id` is the numeric Postgres `users.id`. |
| `users` | `Array<{id, build, modify, modify_otu, remove, created_at?}>` | yes | Per-user permission entries. `id` is the numeric Postgres `users.id`. `created_at` is missing on legacy entries — `data.get()` backfills from the parent `created_at` at read time. The Pydantic `ReferenceUser.created_at` is required, but the live storage path (`db.create_document`) does include it for new writes. |
| `groups` | `Array<{id, build, modify, modify_otu, remove, created_at}>` | yes | Per-group permission entries. `id` is `int \| string` (live: all int Postgres ids). `name` and `legacy_id` are **not** stored on disk in our schema — both are enriched at read time by `get_reference_groups` from Postgres `groups`. (Some legacy docs do persist a `legacy_id` like `"cleansed"`, intentionally dropped from the model.) |
| `archived` | `boolean` | yes | Soft-archive flag. Written by `archive()` / `unarchive()`. Missing on legacy prod docs (none of the 14 prod sample docs have it) — **a backfill defaulting to `false` is a prerequisite for this schema.** Listing endpoints do not filter by it. |
| `cloned_from` | `{ id: string, name: string }` | no | Snapshot of the source reference at clone time. Only on docs created via clone (5/14 in prod). |
| `imported_from` | `UploadMinimal` snapshot | no | Snapshot of the upload row at import time (`upload.to_dict()` — `id`, `name`, `name_on_disk`, `size`, `type`, `user`, `created_at`, `uploaded_at`, `ready`, `removed`, `removed_at`, `reserved`, `space`). Only on docs created via import. The `user` field is a **string handle**, not an object — the original SQL row stores the user that uploaded the file. |
| `installed` | `ReleaseSubdocument` | no | Last successfully installed remote release. Set to `null` by `db.create_remote`, then `$set` to `create_update_subdocument(release, ready=True, ...)` once `populate_remote_reference` finishes. **Note:** `db.processor` and `data.get` *also* derive `installed` for the API response by popping the last entry from `updates` — this overrides the stored value. The stored field exists for `clean_all` and `fetch_and_update_release` to read directly. |
| `release` | `ReferenceRelease` | no | Latest available remote release. Has `content_type` and `download_url` (which the `installed` / `updates` subdocuments do not — `create_update_subdocument` strips them). Only on remote refs. |
| `remotes_from` | `{ errors: any[], slug: string }` | no | Connection info for the GitHub remote. Only on remote refs. `errors` is appended to by `fetch_and_update_release` on connectivity issues. |
| `errors` | `any[]` | no | Top-level error list. Written by `fetch_and_update_release` (`{"$set": {"errors": [...]}}`); usually absent and never has typed entries (`anyOf: []` in the live schema). |
| `updates` | `ReleaseSubdocument[]` | no | History of installed/in-progress updates. Each item shares the `installed` shape (no `content_type` / `download_url`) plus `ready` and `user`. Only on remote refs. `data.processor` / `data.get` pop the last entry to derive the API-level `installed` field. |
| `updating` | `boolean` | no | Flag set during a remote update task. Only on remote refs; cleared to `false` when the update finishes. |

### Embedded shapes

`ReleaseSubdocument` (used by `installed` and each entry of `updates`):

```
{ id: int, name: string, body: string, filename: string, size: int,
  html_url: string, published_at: string,            // ISO string, not Date
  created_at: Date, ready: bool,
  user: { id: string } }
```

`ReferenceRelease` (the `release` field on remote refs) is the same shape **plus** `content_type: string` and `download_url: string` and `retrieved_at: Date`, **minus** `ready` and `user`. `create_update_subdocument` produces an installed/update subdocument *from* a release by stripping `content_type`, `download_url`, `etag`, `retrieved_at` and adding `ready`, `user`, `created_at`.

## Authoritative side

References are **Mongo-primary**. Postgres holds the related row data referenced from inside the document:

- `groups[].id` → Postgres `groups.id` (or `legacy_id` during the migration window).
- `users[].id` and `user.id` → Postgres `users.id` (numeric `int`).
- `imported_from` → snapshot from Postgres `uploads` at import time. The actual upload row may be gone; the snapshot is the durable copy.
- `task.id` → Postgres `tasks.id`.

## Quirks captured from Python

- **Listing is permission-scoped.** `compose_base_find_query` (in `db.py`) builds an `$or` over `groups.id` (against the user's groups), `user.id` (creator), and `users.id` (granted users). Administrators bypass the filter. Any new read path must replicate this.
- **No soft delete.** Removal goes through `mongo.references.delete_one`. `archived` is a separate UX-level flag, not a delete tombstone — listing endpoints do not filter by it.
- **`groups` enrichment.** `get_reference_groups` resolves each entry's `id` against Postgres `groups` (matching either `id` or `legacy_id`) and returns the canonical numeric `id`, the `legacy_id`, and the `name`. The on-disk doc may have a string id (legacy mongo group id) which is replaced at read time. Do not assume `groups[].id` is numeric. The stored `legacy_id` field is **dropped** from our schema; the value is recomputed from Postgres on every read.
- **`users[].created_at` is sometimes missing on legacy docs.** `data.get()` backfills it from the reference's top-level `created_at` before validating with the Pydantic model. New writes always include it.
- **`installed` is dual-sourced.** It is *both* a stored field (set by `populate_remote_reference` / `update_remote_reference`) and a derived field at read time (`updates[-1]` after popping). Don't rely on the stored value being current — `data.processor` / `data.get` overwrite it for the response.
- **`release` includes a synthetic `newer`.** `fetch_and_update_release` recomputes `release.newer` against `installed.name` on every refresh. The stored value is stale between refreshes.
- **Indexes.** `virtool.mongo` does not call `create_index` on `references`. Only the implicit `_id` index exists. `find()` uses an aggregation `paginate` sorted by `name` ascending; `count_documents` uses `remotes_from.slug` for `get_official_installed`. No application-managed compound or text indexes.
- **Collection name is `references` (plural).** Confirmed by `mongo.references` binding in `db.py` and the standard `Mongo` core mapping. Set explicitly on the schema as well.

## Mongoose schema

`apps/web/src/server/db/mongo/references.ts`. Uses `strict: false` so legacy docs round-trip without losing unknown fields, and `collection: 'references'` to match the live name.

Inferred type: `ReferenceDoc` (`InferSchemaType<typeof referenceSchema>`).

Mixed-typed fields (`Schema.Types.Mixed`):

- `task` — to allow `null | { id: int }`.
- `errors` — array of unknown shape; the live validator's `items.anyOf` is empty.
- `groups[].id` — `int | string` during the group-id backfill window.
- `groups[]` and `users[]` sub-schemas use `strict: false` — `get_reference_groups` and `_extend_user` add `legacy_id` / `handle` / `name` at read time and we want round-trips to round-trip cleanly.

Sub-schemas with `strict: false` (release / installed / update / imported_from): the live data has consistent shapes today, but these objects are imported wholesale from upstream sources (GitHub, Postgres `uploads`) and we should not error on a new key showing up.

## Open follow-ups

- `groups[].id` will become numeric only after the group-id backfill is run.
- `installed` derivation overlap (stored vs `updates[-1]`) is a footgun — the new TS read path should pick one source explicitly, probably `updates[-1]` to match current API behaviour, and ignore the stored field.
