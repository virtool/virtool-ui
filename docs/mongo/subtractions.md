# subtractions

Host genome FASTA files that pathoscope/nuvs analyses align reads against to remove host-derived reads.

> **Collection name.** The Mongo collection is `subtraction` (singular), even though the domain, API path, and Postgres `subtraction_files` table all use the plural. The Python code binds it as `mongo.subtraction`. The Mongoose model passes `collection: 'subtraction'` to keep this exact.

## Source

- Python module: `virtool/subtractions/{db,data,models,api,pg}.py`
- Pydantic models: `virtool/subtractions/models.py` (`Subtraction`, `SubtractionMinimal`, `NucleotideComposition`, `SubtractionUpload`)
- Live schema sample: 38 documents from production (Compass-generated JSON Schema, supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric, server-generated via `virtool.mongo.utils.get_new_id`. **Not** an ObjectId. |
| `name` | `string` | yes | User-facing display name (e.g. `"Arabidopsis thaliana"`). |
| `nickname` | `string` | yes | Frequently empty (`""`). Required string, not optional. |
| `created_at` | `Date` | yes | UTC. |
| `deleted` | `boolean` | yes | Soft-delete flag — listing queries always filter `deleted: false`. |
| `ready` | `boolean` | yes | Flipped to `true` by `finalize()` once the bowtie2 indexing workflow completes. |
| `file` | `{ id: int, name: string }` | yes | Snapshot of the upload at create time (`upload.id`, `upload.name`). The numeric `id` references Postgres `uploads.id`. Stored even after the upload row is gone, so this is the durable name. |
| `user` | `{ id: string }` | yes | `id` is currently the user handle (legacy string ID); will become a numeric Postgres user id post-backfill. |
| `count` | `int \| null` | no | Sequence count from the FASTA. `null` until `finalize()`. Missing on a few legacy docs (≈19% of prod sample). |
| `gc` | `{ a, c, g, t: number; n?: number } \| null` | no | Nucleotide composition. `null` until `finalize()`. `n` is absent on older finalized docs (≈35% of those that have `gc`) — it was added later. |
| `has_file` | `boolean` | no | Legacy flag. Present on ~87% of prod docs, absent on the rest. Not written by the current `create()` path; do not rely on it for new logic. |
| `job` | `{ id: string }` | no | Reference to the create-subtraction job. Only set on docs created after the job-tracking change (very rare in old data — 1/38 in prod sample). |
| `space` | `{ id: int }` | no | Multi-tenancy hook. Only set on docs created after spaces shipped (1/38 in prod sample). |
| `upload` | `int` | no | Numeric Postgres `uploads.id` of the source upload. Only present on a small number of newer docs (3/38). The durable upload reference is `file`; this field is informational. |

## Authoritative side

Subtractions are **Mongo-primary**. Postgres has a related `subtraction_files` table (per-bowtie2/fasta artefact, with size/type/ready), but the subtraction document itself lives in Mongo. The numeric upload id and (eventually) user id are pointers into Postgres.

## Quirks captured from Python

- `find()` and listing endpoints always filter `{ deleted: false }`.
- `subtraction_processor` defaults `subtractions: document["subtractions"] or []` — but that's a **sample**-side concern, not subtractions. Do not add a `subtractions` field to this collection.
- `attach_computed` joins `linked_samples` (samples whose `subtractions` array contains this id) and `files` (Postgres `subtraction_files`) at read time. Neither is stored on the document.
- `unlink_default_subtractions` runs on delete and pulls the id out of every sample's `subtractions` array — relevant for the samples model, noted here so it isn't lost.
- Indexes: no application-managed Mongo indexes on this collection beyond the implicit `_id`. Sorting/filtering happens in-memory or via the aggregation pipeline in `data.find()`.

## Mongoose schema

`apps/web/src/server/db/mongo/subtractions.ts`. Uses `strict: false` so legacy docs round-trip without losing unknown fields, and explicit `collection: 'subtraction'` to match the live name.

Inferred type: `SubtractionDoc` (`InferSchemaType<typeof subtractionSchema>`).

## Open follow-ups

- `user.id` will need to become numeric (or become a `legacy_id` lookup) after the user-id backfill. Not in scope for this port.
- `has_file` looks dead. Confirm with a fresh prod scan and consider stripping it once we do a tightening pass.
- `space` will likely become required once spaces are fully rolled out — keep it optional during the port.
