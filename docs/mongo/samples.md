# samples

User-uploaded sequencing samples. Mongo is the primary store for sample documents; per-file artefact and reads metadata lives in Postgres (`sample_artifact`, `sample_reads`), as do uploads (`uploads`).

## Source

- Python module: `virtool/samples/{db,data,models,checks,api,sql,files}.py`
- Pydantic models: `virtool/samples/models.py` (`Sample`, `SampleMinimal`, `SampleSearchResult`, `WorkflowState`, `SampleWorkflows`)
- Mongo binding: `virtool.mongo.core.Mongo.samples` → collection name `samples` (plural).
- Live schema: production `$jsonSchema` validator (Compass export, supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric, server-generated via `virtool.mongo.utils.get_new_id`. **Not** an ObjectId. |
| `name` | `string` | yes | User-facing display name. Uniqueness enforced application-side via `check_name_is_in_use`. |
| `host` | `string` | yes | User-defined host. |
| `isolate` | `string` | yes | User-defined isolate. |
| `locale` | `string` | yes | User-defined locale. |
| `notes` | `string` | yes | Free-text. Often empty (`""`). |
| `format` | `string` | yes | Always `"fastq"` in `create()`. Required by validator. |
| `library_type` | `string` | yes | One of `LibraryType` values (`"normal"`, `"srna"`, `"amplicon"`, …). Drives `define_initial_workflows`. |
| `paired` | `boolean` | yes | Set from `len(uploads) == 2` at create. |
| `created_at` | `Date` | yes | UTC. |
| `ready` | `boolean` | yes | Flipped by `finalize()` once create-sample job completes. |
| `hold` | `boolean` | yes | Initialised `true`; gates the post-finalize cleanup. |
| `quality` | `Quality \| null` | yes | `null` until `finalize()` writes the FastQC summary. Embedded shape: `bases`, `composition` (arrays of arrays of `int\|double`), `count: int`, `encoding: string`, `gc: int\|double`, `length: int[]`, `sequences: int[]`. |
| `labels` | `int[]` | yes | Postgres `labels.id` references. |
| `subtractions` | `string[]` | yes | Mongo `subtraction._id` references. Mutated on subtraction delete (`unlink_default_subtractions`). |
| `user` | `{ id: int }` | yes | Numeric Postgres `users.id`. The live `bsonType` still allows `string` (legacy handles) but per the port plan all user-id reads will go through the backfilled numeric form — modelled as `Number`. |
| `job` | `{ id: string } \| null` | yes | Reference to the create-sample job. Always written on new docs (post-2021), but legacy docs can have `null`. |
| `group` | `int \| string \| null` | yes | Owner group. The live validator says `int \| null`, but `data.py` and `db.py` actively normalise the string `"none"` to `null` and `validate_force_choice_group` accepts a `string` legacy id. Modelled as `Mixed` to round-trip all three. |
| `group_read` / `group_write` / `all_read` / `all_write` | `boolean` | yes | Permission bits. Defaulted from `Settings`. |
| `workflows` | `{ aodp, iimi, nuvs, pathoscope: string }` | yes | `WorkflowState` enum (`"complete" \| "incompatible" \| "none" \| "pending"`). The Pydantic `SampleWorkflows` model only declares three keys (`aodp`, `nuvs`, `pathoscope`) but the live validator and `define_initial_workflows` write four — `iimi` is included. Trust the validator. |
| `uploads` | `{ id: int }[]` | no | Snapshot of source upload rows at create. Absent on docs predating the uploads feature. The numeric `id` references Postgres `uploads.id`. |
| `results` | `null` | no | Always `null` when present. Reserved field — no non-null value observed in prod or written by current code. |

## Authoritative side

Samples are **Mongo-primary**. Postgres holds the per-file artefact/reads metadata and the uploads referenced by `uploads[].id` and `labels[]`. Group references (`group`) and user references (`user.id`) point into Postgres but pre-backfill can still carry legacy string ids.

## Quirks captured from Python

- **Listing is permission-scoped.** `data.find()` filters by `all_read`, plus `user.id` variants from `get_user_id_single_variants` (handles the legacy string ↔ numeric user-id transition), plus group-read for groups the client belongs to. Any read path the new code adds must replicate this — not just `{ deleted: false }`-style filters (samples have no soft-delete flag).
- **Group transition.** `data.get()` and `has_right()` both special-case `group == "none"` → `None`. Don't tighten `group` to `Number | null` until backfill removes string variants.
- **Workflow keys.** `define_initial_workflows` writes `aodp`, `iimi`, `nuvs`, `pathoscope`. The Pydantic `SampleWorkflows` is missing `iimi` — the live validator is the truth.
- **`results` is reserved.** Written as `null` in `create()` and not updated anywhere in `data.py`/`db.py`. Don't drop it; legacy code may read it.
- **No application-managed indexes.** `virtool/mongo` does not call `create_index` on `samples`. Only the implicit `_id` index exists. Sorting/filtering happens via the aggregation pipeline in `data.find()` (sort by `created_at` desc).
- **`uploads` is informational; reads/artefacts authoritative in Postgres.** `AttachUploadsTransform` joins Postgres `uploads` by `uploads[].id`. `AttachArtifactsAndReadsTransform` reads `sample_artifact` / `sample_reads` directly — those are not stored on the Mongo doc.
- **`subtractions` is mutated externally.** When a subtraction is deleted, `unlink_default_subtractions` `$pull`s its id from every sample's `subtractions` array. Note this if porting the subtractions delete path.
- **`paired` is derived at create time** from `len(uploads) == 2`, but `data.get()` recomputes it from the Postgres reads count (`paired=len(document["reads"]) == 2`) before returning. The stored field can disagree with the served field for samples whose reads were re-uploaded.

## Mongoose schema

`apps/web/src/server/db/mongo/samples.ts`. Uses `strict: false` so legacy docs round-trip without losing unknown fields. Collection name set explicitly to `samples`.

Inferred type: `SampleDoc` (`InferSchemaType<typeof sampleSchema>`).

Mixed-typed fields (`Schema.Types.Mixed`):

- `group` — to allow `number | string | null`.
- `results` — always `null`, but `Mixed` keeps the door open to legacy non-null values without throwing on read.

`user.id` is typed `Number` even though the live validator still permits `string`: the backfill is the gate for this port and the new code reads numeric ids only. Legacy string-id docs that haven't been backfilled will fail this schema's cast — flag them as a backfill prerequisite, don't loosen the schema.

## Open follow-ups

- `group` can become `Number | null` after the legacy-string and `"none"` backfills are done.
- `format` and `results` look dead-write/dead-read; revisit during a tightening pass.
