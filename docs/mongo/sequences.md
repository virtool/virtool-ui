# sequences

Nucleotide sequences belonging to an isolate of an OTU. Stored as a separate collection (not embedded in `otus`) and joined into the parent OTU at read time via `merge_otu` (`virtool/otus/utils.py:123`). Mongo is the primary store.

## Source

- Python module: `virtool/otus/{db,data,utils,api,oas}.py` (sequences live under the OTU domain — there is no `virtool/sequences/` module).
- Pydantic models: `virtool/otus/models.py` (`OTUSequence`, `Sequence`, `OTURemote`).
- Mongo binding: `virtool.mongo.core.Mongo.sequences` → collection name `sequences` (`virtool/mongo/core.py:180`).
- Live schema: production Compass-generated `$jsonSchema` validator (supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric (locally created via `id_provider`/sequence_id arg) **or** 12-char (imported via `references/alot.prepare_otu_insertion`). Both lengths exist in prod. Not an ObjectId. |
| `accession` | `string` | yes | NCBI/genbank accession. Stripped, min length 1 on writes (`oas.CreateSequenceRequest`). |
| `definition` | `string` | yes | Free-text description. Stripped, min length 1 on writes. |
| `host` | `string \| null` | yes | Host organism name. `data.create_sequence` writes a string default of `""`; the live validator allows `string | null`. Both forms exist in prod, so we model as `Mixed`. |
| `isolate_id` | `string` | yes | Foreign key to `otus.isolates[].id` within the same parent OTU. Variable length (8 or 12 char) — see `_id`. |
| `otu_id` | `string` | yes | Foreign key to `otus._id`. The `(otu_id, isolate_id)` pair is the read-time join key in `mongo.sequences.find({otu_id})` (`otus/db.py:137`, `otus/data.py:120`). |
| `reference` | `{ id: string }` | yes | Embedded ref to the parent OTU's `references._id`. Denormalized — copied from the parent OTU on insert (`data.create_sequence`) and from the import payload (`alot.prepare_otu_insertion`). Used directly for bulk delete on import-failure rollback (`data.populate_imported_reference`: `mongo.sequences.delete_many({"reference.id": ref_id})`). |
| `remote` | `{ id: string }` | no | Set only on sequences sourced from a remote/imported reference. `remote.id` is the upstream sequence's id (the original `_id` if no upstream `remote` block, otherwise the upstream `remote.id`). Absent on locally-created sequences. |
| `segment` | `string \| null` | yes | Segment name matching one of the parent OTU's `schema[].name` entries. `data.create_sequence` writes a string default of `""`; `alot.prepare_otu_insertion` also defaults to `""`. The live validator allows `string | null`. Modelled as `Mixed`. Cleared (`$unset`) by `db.update_sequence_segments` when the parent OTU's schema renames a segment away. |
| `sequence` | `string` | yes | The nucleotide sequence itself. Whitespace and newlines are stripped on write (`data.create_sequence`/`update_sequence`: `.replace(" ", "").replace("\n", "")`). API writes restrict to `[ATCGNRYKM]+` (`oas.py`); legacy stored docs may not match this regex — do **not** validate on read. |
| `target` | `string \| null` | no | Used only on barcode references. `data.create_sequence` writes `string | None`. The Compass-generated validator on the supplied prod database lists `target` as `null`-only — that snapshot has no barcode references in use; the field is real and string-valued elsewhere. Modelled as `Mixed` to round-trip both. |

## Authoritative side

Sequences are **Mongo-primary**.

- `otu_id` → Mongo `otus._id`.
- `isolate_id` → `otus.isolates[].id` within that OTU.
- `reference.id` → Mongo `references._id`. Denormalized (copied from the parent OTU); the parent OTU's `reference.id` is the source of truth — they should always match.
- `remote.id` → upstream Mongo sequence id from the imported source. Not a Postgres row.

## Quirks captured from Python

- **Sequences live outside the OTU document.** Despite the API exposing them as `OTU.isolates[].sequences[]`, storage is a separate collection. The merge happens at read time in `merge_otu` (`otus/utils.py:123`) by filtering `sequences` by `isolate_id` per isolate. Writes split them back out via `split` (`otus/utils.py:144`).
- **`reference.id` is denormalized.** Sequences carry their own `reference.id` rather than relying on the parent OTU. This enables `delete_many({"reference.id": ref_id})` in import-rollback (`references/data.py:1084`) without first joining to OTUs. Maintain this on writes — set it from the parent OTU's `reference.id`.
- **`SEQUENCE_PROJECTION` excludes `remote` and `target`.** `otus/db.py:19` lists `_id, accession, definition, host, otu_id, isolate_id, reference, sequence, segment` — `remote` and `target` are intentionally not surfaced through the read path. Don't trim them from storage; just match the projection at the API boundary.
- **`format_otu` strips `otu_id` and `isolate_id` and renames `_id` → `id`.** When sequences are returned nested under their isolate, the parent context is removed (`otus/utils.py:91-96`). Storage keeps both fields; the rename is API-side only.
- **`update_sequence_segments` mutates `segment` on schema renames.** When the parent OTU's `schema[].name` set changes, sequences whose `segment` is in the removed names get `$unset: { segment: "" }` (`otus/db.py:303`). After this, `segment` is absent — not `null`, not `""`. Reads need to tolerate all three.
- **`target` uniqueness is per-isolate.** `db.check_sequence_segment_or_target` enforces `target` uniqueness within `(otu_id, isolate_id)` for barcode references via `mongo.sequences.distinct("target", ...)`. The constraint is application-managed; no Mongo unique index backs it.
- **No application-managed indexes.** `virtool.mongo` does not call `create_index` on `sequences`. Only the implicit `_id` index exists. The hot read paths filter by `otu_id` (single-field) and `(otu_id, isolate_id)` (compound). Adding indexes is intentionally out of scope for the port.
- **`host` and `segment` are required-but-nullable in the validator.** The live `$jsonSchema` lists both as required with `bsonType: ["string", "null"]`. `data.create_sequence` always supplies them (defaulting to `""`), but legacy/imported docs hold `null`. Stored as `Schema.Types.Mixed` to round-trip both.
- **Mixed `_id` lengths come from import vs. create paths.** `random_alphanumeric(length=12)` in `alot.prepare_otu_insertion` produces 12-char ids; `id_provider`/explicit `sequence_id` in `data.create_sequence` produces 8-char. Don't enforce length.
- **Bulk insert/update goes through `OTUDataBulkUpdater`.** Reference imports/cloning/remote populates fan out through `references/bulk.py` buffers (`update_sequence_buffer`, `insert_sequence_buffer`, `delete_sequence_buffer`). The new TS write path needs to support the same operations or stage them outside until cutover.
- **Collection name is `sequences` (plural).** Confirmed by `mongo.sequences` binding in `mongo/core.py:180`.

## Mongoose schema

`apps/web/src/server/db/mongo/sequences.ts`. Uses `strict: false` so legacy/dropped fields round-trip without loss, and `collection: 'sequences'` to match the live name.

Inferred type: `SequenceDoc` (`InferSchemaType<typeof sequenceSchema>`).

Mixed-typed fields (`Schema.Types.Mixed`):

- `host` — required-but-nullable; `string | null` in prod.
- `segment` — required-but-nullable; `string | null` in prod, also absent after `update_sequence_segments` `$unset`.
- `target` — `string | null` in code; validator on the supplied snapshot says `null`-only because no barcode refs were active there.

## Dropped fields

None. All validator-listed fields are modelled.

## Open follow-ups

- Compound indexes on `(otu_id)` and `(otu_id, isolate_id)` are obvious wins for the join path (`merge_otu` reads by `otu_id` for every OTU read) — not added during the port to match current Mongo state, but worth doing once the new code owns writes.
- The `target` validator vs. Python-code mismatch (validator allows `null` only; Python writes strings on barcode refs) is worth confirming against a barcode-reference-bearing database before tightening the schema.
- `reference.id` denormalization is duplicate state with `otus.reference.id` — the only thing keeping them in sync is convention. A per-collection consistency check is worth running pre-cutover.
