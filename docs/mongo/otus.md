# otus

Operational Taxonomic Units — viruses (or other taxa) stored under a parent reference. Each OTU owns a list of embedded `isolates`; each isolate's sequences live in the separate `sequences` collection and are joined at read time via `merge_otu`. Mongo is the primary store.

## Source

- Python module: `virtool/otus/{db,data,models,utils,api,oas}.py`
- Pydantic models: `virtool/otus/models.py` (`OTU`, `OTUMinimal`, `OTUIsolate`, `OTUSegment`, `OTUSequence`, `OTURemote`)
- Mongo binding: `virtool.mongo.core.Mongo.otus` → collection name `otus`
- Live schema: production Compass-generated JSON Schema (supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric, server-generated. **Not** an ObjectId. Generated via `random_alphanumeric(length=8)` in `references/alot.py` for bulk imports; via `id_provider` for fresh creates. |
| `name` | `string` | yes | User-facing display name. |
| `lower_name` | `string` | yes | `name.lower()`. Maintained on every write that touches `name` (see `data.update`); used for case-insensitive duplicate checks (`db.check_name_and_abbreviation`). |
| `abbreviation` | `string` | yes | Often empty (`""`). Duplicate-checked per reference in `db.check_name_and_abbreviation`. |
| `version` | `int` | yes | Monotonic per-OTU revision. Incremented (`$inc: {version: 1}`) on every write to the OTU or its sequences via `increment_otu_version`. Initialised to `0`. |
| `verified` | `bool` | yes | Set to `false` on every mutation, then flipped to `true` by `update_otu_verification` if `verify(joined)` returns `None`. Do not write `true` directly. |
| `last_indexed_version` | `int \| null` | yes | The `version` value at the last successful index build. `null` until the OTU is included in a built index. **Mixed type** (`int | null`). |
| `reference` | `{ id: string }` | yes | Parent reference id (string `_id` of `references`). Embedded ref, not enriched at read time — listing transforms attach the parent name via `AttachReferenceTransform`. |
| `isolates` | `Array<OTUIsolate>` | yes | Embedded isolates. May be empty (`[]`) on freshly-created OTUs (`data.create` writes `isolates: []`). |
| `schema` | `Array<OTUSegment>` | yes | Genome segment definitions. Empty array on barcode references and on imports without a schema (`otu.get("schema", [])` in `references/db.insert_joined_otu`). |
| `created_at` | `Date \| string \| null` | no | UTC datetime on imports (set by `prepare_otu_insertion` and `insert_joined_otu`). **Not** written by `data.create` for fresh OTUs — they have no `created_at` at all. **Mixed type:** prod docs vary across `Date`, ISO `string`, and `null`. Do not normalise on read. |
| `remote` | `{ id: string }` | no | Set only on OTUs sourced from a remote/imported reference. `remote.id` is the upstream OTU's `_id`. Absent on locally-created OTUs. |
| `user` | `{ id: string }` | no | Creator id on **imported** OTUs only (`insert_joined_otu` and `prepare_otu_insertion`). `data.create` does **not** write a `user` field, so locally-created OTUs lack this entirely. The id is stored as a string here, even though the canonical Postgres `users.id` is numeric. |

### `OTUIsolate`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Per-isolate id, 8-char (fresh) or 12-char (imported via `prepare_otu_insertion`). Unique within the parent OTU. |
| `default` | `bool` | yes | Exactly one isolate is default per OTU. `add_isolate` flips others to `false` when promoting; `remove_isolate` promotes the first remaining isolate when the default is removed. |
| `source_type` | `string` | yes | E.g. `"isolate"`, `"strain"`. Constrained to `references.source_types` when `references.restrict_source_types` is true. |
| `source_name` | `string` | yes | Free text. Joined with `source_type` to produce the human-readable isolate name (`format_isolate_name`). |

### `OTUSegment`

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | `string` | yes | Segment name (e.g. `"RNA1"`). Used to constrain `sequences.segment` for genome references. |
| `molecule` | `string` | yes | One of the `Molecule` enum values (`"ssDNA"`, `"ssRNA+"`, etc.) **or `""`**. Pydantic's `OTUSegment.make_molecule_nullable` converts `""` → `None` at read time, but the stored value is the string. Schema marks it required to match the live validator. |
| `required` | `bool` | yes | Whether this segment must be present in every isolate of this OTU for verification to pass. |

## Authoritative side

OTUs are **Mongo-primary**. The only Postgres reference is the user id embedded in legacy import paths (`user.id`), and even that is stored as a string handle here.

- `reference.id` → Mongo `references._id` (string).
- `remote.id` → upstream Mongo `_id` (string) from the remote source — **not a Postgres row**.
- `user.id` → Postgres `users.id` (numeric) but **stored as string** on imported docs. Do not assume it parses as int.
- Sequences live in the separate `sequences` collection and are joined at read time via `mongo.sequences.find({otu_id: <id>})` (`db.join`, `db.bulk_join_documents`).

## Quirks captured from Python

- **Listing is reference-scoped.** `db.find` builds `base_query = {"reference.id": ref_id}` and adds a regex over `name`/`abbreviation` for `term`. Sort is by `name` ascending. The new TS read path must replicate.
- **`modified_count` is computed off `history`.** `db.find` adds `data["modified_count"] = len(distinct("otu.name", {"index.id": "unbuilt", "reference.id": ref_id}))`. The OTU collection itself does not carry a "dirty" flag — modification state is derived from the `history` collection.
- **`verify` runs on the joined doc.** Verification needs the sequences merged in (`merge_otu`), not just the OTU. `update_otu_verification` calls `verify(joined)` and only updates the stored `verified` boolean — it does **not** persist the `issues` object back to the OTU (see Dropped fields).
- **`schema` is a Mongo keyword.** Mongoose treats `schema` as a reserved word on `Schema` instances; we use it as a field name anyway — `strict: false` and the schema-level `collection: 'otus'` keep it round-tripping. Reads and writes go through the Mongoose model property like any other field; the only constraint is not to confuse it with the schema *constructor*.
- **Isolate ids vary in length.** Locally-created via `id_provider.get()` (8-char in current Mongo config), imported via `random_alphanumeric(length=12)`. Both forms exist in prod. Do not assume a fixed length.
- **`last_indexed_version` is mixed-typed.** Live validator allows `int | null`. We store as `Schema.Types.Mixed` to preserve `null` round-trip without forcing `Number`.
- **`created_at` mixed types are real, not a validator quirk.** Prod docs hold `Date`, ISO `string`, and `null` in the same column. Don't normalise — stored type is load-bearing for legacy reads.
- **`user` is missing on locally-created OTUs.** `data.create` never writes a `user` field; only the `references` import paths do. Do not require it.
- **`remote` is the only signal of import provenance.** Once `imported` is dropped (see below), `remote.id` is what tells you an OTU originated from a remote reference.
- **No application-managed indexes.** `virtool.mongo` does not call `create_index` on `otus`. Only the implicit `_id` index exists. Reads filter by `reference.id`, `lower_name`, `abbreviation`, and `name` — adding compound indexes is a separate optimisation and is intentionally out of scope for the port.
- **Collection name is `otus` (plural).** Confirmed by `mongo.otus` binding in `mongo/core.py:175`.

## Mongoose schema

`apps/web/src/server/db/mongo/otus.ts`. Uses `strict: false` so legacy/dropped fields round-trip without loss, and `collection: 'otus'` to match the live name.

Inferred type: `OTUDoc` (`InferSchemaType<typeof otuSchema>`).

Mixed-typed fields (`Schema.Types.Mixed`):

- `created_at` — live validator allows `Date | string | null`.
- `last_indexed_version` — `int | null`.

Sub-schema with `strict: false`:

- `otuIsolateSchema` — legacy isolate entries occasionally carry extra keys (e.g. from older import scripts); preserve unknown keys on round-trip.

## Dropped fields

`imported`, `issues`, and `taxid` exist in prod but are intentionally not modelled.

## Open follow-ups

- `user.id` storage as string on imported OTUs vs. numeric Postgres `users.id` is a real divergence. The TS read path should coerce on the way out, or we should backfill the stored value to numeric once we own the writes.
- `schema[].molecule = ""` is currently treated as required-but-empty; the API surface converts to `null`. Decide whether the port-time TS read path should mirror the Pydantic coercion or expose the raw value.
- Compound indexes on `(reference.id, lower_name)` and `(reference.id, abbreviation)` are obvious wins for the duplicate-check path and listing — not added during the port to match current Mongo state, but worth doing once the new code owns writes.
