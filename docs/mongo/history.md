# history

Per-OTU change log. Every create/edit/remove of an OTU, isolate, or sequence appends one document. The `diff` field carries (or points at) a `dictdiffer` patch that lets `patch_to_version` rewind a joined OTU back to any prior version. Mongo-only collection.

## Source

- Python module: `virtool/history/{db,data,models,api,sql,transforms,utils}.py`
- Pydantic models: `virtool/history/models.py` (`History`, `HistoryMinimal`, `HistoryNested`, `HistorySearchResult`, `HistoryIndex`, `HistoryOTU`)
- Mongo binding: `virtool.mongo.core.Mongo.history` → collection name `history` (singular).
- Live schema: production `$jsonSchema` validator (Compass export, supplied during port).
- Companion table: Postgres `history_diffs` (`virtool/history/sql.py::SQLHistoryDiff`) holds the actual diff JSON for documents whose `diff` field is the sentinel string `"postgres"`.

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | Composite `{otu_id}.{otu_version}` (e.g. `"1wfc5x6e.3"`, `"1wfc5x6e.removed"`). Built in `prepare_add`; the change-id format is what the delete path splits on (`change_id.split(".")`). **Not** an 8-char id and **not** an ObjectId — different from every other collection. |
| `created_at` | `Date` | yes | UTC. |
| `description` | `string` | yes | Human-readable, composed by `compose_history_description` from method + OTU name + abbreviation. May be passed in by the caller. |
| `method_name` | `string` | yes | One of the `HistoryMethod` enum values: `add_isolate`, `create`, `create_sequence`, `clone`, `edit`, `edit_sequence`, `edit_isolate`, `remove`, `remote`, `remove_isolate`, `remove_sequence`, `import`, `set_as_default`, `update`. Stored as the bare `.value` string. |
| `index` | `{ id: string, version: int \| string }` | yes | The build the change is included in. Newly written changes always have `{id: "unbuilt", version: "unbuilt"}` (literal strings — see quirks). Set to a real `{id, version: int}` when the OTU is included in an index build. |
| `otu` | `{ id: string, name: string, version: int \| string }` | yes | OTU snapshot at change time. `version` is `int` for create/edit-style changes and the literal string `"removed"` for remove changes (`derive_otu_information`). |
| `reference` | `{ id: string }` | yes | Parent reference id. Used by the delete path to authorise via `check_right`. |
| `user` | `{ id: int \| string }` | yes | The acting user. Modern writes store the numeric Postgres `users.id` (`prepare_add` types `user_id: int`). Legacy docs predating the user-id migration store a string handle — `AttachUserTransform` resolves both via `compose_legacy_id_multi_expression`. The live validator only declares `string`; trust the code path, not the validator. Modelled as `Mixed`. |
| `diff` | `string \| array \| object` | yes | Polymorphic — see "The `diff` field" below. |

## The `diff` field

Four shapes, all required to round-trip:

1. **`"postgres"`** — sentinel string. Indicates the diff JSON lives in Postgres `history_diffs.diff` keyed by `change_id`. This is what `prepare_add` writes for **all new changes** today.
2. **`"file"`** — sentinel string. Indicates the diff lives on the storage backend at `history/{otu_id}_{otu_version}.json` (`utils.diff_key`). Legacy intermediate format; `AttachDiffTransform` and `patch_to_version` still know how to read these.
3. **`Array<[op, path, value]>`** — inline `dictdiffer.diff(old, new)` output for `edit`-style methods. Outer array of per-op tuples; values can be strings, ints, nulls, deeply-nested OTU/isolate/sequence objects, or further nested arrays. The live validator's `anyOf` chain reflects this — every legacy intermediate shape is allowed.
4. **`Object`** — the full pre/post OTU document for `create` / `remove` methods on **legacy docs that predate the file/postgres redirect**. `prepare_add` historically wrote `diff = new` (create) or `diff = old` (remove) directly into the document; today it writes `"postgres"` and stores the same payload in `history_diffs`. Old docs in prod still carry the embedded object.

Modelled as `Schema.Types.Mixed`. **Do not** add a Mongoose validator for this — every shape above coexists in prod and the read path branches on `typeof diff === "string"`.

## Authoritative side

History is **Mongo-only** in terms of the change document, but the diff payload for new writes is **Postgres-primary** (`history_diffs`). The Mongo `diff` field for new docs is just the sentinel `"postgres"`. Reads must consult the storage backend / Postgres to materialise the actual diff (see `AttachDiffTransform`).

User and reference identifiers point into Postgres / `references` respectively but are not enriched at storage time — `data.get()` runs `AttachUserTransform` and `AttachReferenceTransform` at read time.

## Quirks captured from Python

- **`_id` is composite, not random.** Format `{otu_id}.{otu_version}`. Built in `prepare_add` and parsed in `data.delete` via `change_id.split(".")`. Anything porting OTU revert logic must construct this exact format.
- **Two literal-string version values.** `otu.version` is `"removed"` for remove-method changes; `index.version` is `"unbuilt"` until the change is rolled into a build. `patch_to_version` compares with both numeric and string forms (`change["otu"]["version"] == "removed" or change["otu"]["version"] > version`). Don't tighten either to `Number`.
- **Sort is on `otu.version`, not `created_at`.** `find()` sorts by `otu.version` desc; `patch_to_version` and `get_most_recent_change` likewise. `created_at` is informational. A new index, if we add one, should be `{ "otu.id": 1, "otu.version": -1 }` — but Python doesn't create one (see below).
- **No application-managed indexes.** `virtool/mongo` does not call `create_index` on `history`. Only the implicit `_id` index exists. `data.find()` and `patch_to_version` rely on collection scans + sorts; performance is presumably tolerable because of the projection. Don't add indexes during the port without measuring.
- **`diff` sentinels move between revs.** Code today only ever writes `"postgres"` for new changes, but reads must handle `"file"`, inline objects, and inline arrays for legacy docs. The order of reigns: embedded → file → postgres.
- **`get_contributors` aggregates on `user.id`.** Pipeline `[{$match: query}, {$group: {_id: "$user.id", count: ...}}]` then resolves both modern and legacy ids through `compose_legacy_id_multi_expression`. If we narrow `user.id`, this aggregation breaks for unbackfilled prod data.
- **Delete is destructive across collections.** `HistoryData.delete` reverts the OTU by walking back the diff chain (`patch_to_version`), then deletes/replaces the OTU + its sequences and `delete_many`s the trailing history rows. Refuses if `index.{id,version}` is anything other than `"unbuilt"` (`DatabaseError("Change is included in a build...")`). Anything porting this path must keep that invariant.
- **`description` is required and never empty.** `prepare_add` falls back to `compose_history_description(method_name, otu_name, abbreviation)` when the caller passes `""`. Don't model as optional.
- **`method_name` enum is bigger than the public API suggests.** The Pydantic `HistoryMethod` enum has 14 values including `clone`, `remote`, `import`, `update`, `set_as_default` — not just the obvious CRUD verbs. Don't validate against a narrower set.

## Mongoose schema

`apps/web/src/server/db/mongo/history.ts`. Uses `strict: false` so legacy docs round-trip without losing unknown fields. Collection name set explicitly to `history`.

Inferred type: `HistoryDoc` (`InferSchemaType<typeof historySchema>`).

Mixed-typed fields (`Schema.Types.Mixed`):

- `diff` — to allow the four shapes (sentinel string `"postgres"` / `"file"`, `dictdiffer` array, embedded OTU object).
- `index.version` — `int | string` (`"unbuilt"`).
- `otu.version` — `int | string` (`"removed"`).
- `user.id` — `int | string` (legacy handles vs Postgres ids; no backfill is planned for this Mongo-only collection).

No indexes are declared on the schema because the Python side declares none.

## Open follow-ups

- **Inline-object and `"file"` diffs are tech debt.** Once a backfill rewrites every `diff: object` and `diff: "file"` entry into Postgres, `diff` collapses to `"postgres"` (a constant) and the field can be dropped from new writes entirely. Track separately from the schema port.
- **`user.id` legacy strings.** Same situation as `samples`/`references` but with no migration path — history is append-only, so legacy entries will carry string ids forever unless explicitly rewritten.
- **Indexing.** The `(otu.id, otu.version desc)` access pattern is hot enough that we should measure on a prod-shaped dataset before deciding whether to add a Mongo index in the new code. Out of scope for the schema port itself.
