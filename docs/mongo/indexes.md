# indexes

A bowtie2/FASTA index built from a reference's OTU set at a moment in time. Each build snapshots which OTU versions were included (`manifest`) and a job assembles the bowtie2 artefacts on disk. The Mongo document is the durable record of the build; the per-file artefacts (`reference.fa.gz`, `reference.N.bt2`, etc.) live in Postgres `index_files` plus object storage.

## Source

- Python module: `virtool/indexes/{db,data,models,api,sql,files,checks,utils}.py`
- Pydantic models: `virtool/indexes/models.py` (`IndexNested`, `IndexMinimal`, `Index`, `IndexFile`, `IndexContributor`, `IndexOTU`)
- Mongo binding: `virtool.mongo.core.Mongo.indexes` → collection name `indexes` (plural).
- Postgres companion: `SQLIndexFile` (`virtool/indexes/sql.py`) — one row per built artefact, attached at read time by `attach_files` / `IndexFilesTransform`.
- Live schema: production `$jsonSchema` validator (Compass export, supplied during port). The `manifest` field was excluded from the export because it is too large to round-trip through Compass; it is documented below from the Python writer.

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | 8-char alphanumeric, server-generated via `virtool.mongo.utils.get_new_id`. **Not** an ObjectId. The string `"unbuilt"` is also reserved as a sentinel `index.id` on `history` documents that are not yet part of any build, but `"unbuilt"` does not appear in this collection — only in `history`. |
| `created_at` | `Date` | yes | UTC. |
| `version` | `int` | yes | Per-reference monotonic version, computed by `get_next_version` as `count_documents({reference.id, ready: true})` at create time. Two concurrent builds for the same reference would race here, but `create_index` rejects new builds while a non-ready one exists (`Index build already in progress`), so the count-based versioning is safe in practice. |
| `ready` | `boolean` | yes | Flipped to `true` by `finalize()` once the FASTA (and bowtie2 artefacts, for genome refs) have all been uploaded and `update_last_indexed_versions` has run. |
| `has_files` | `boolean` | yes | Always `true` in `create()`. Legacy flag — predates the Postgres `index_files` table. Don't rely on it for new logic; use the joined `files` rows instead. |
| `has_json` | `boolean` | yes | `false` at create. Flipped by the `otus.json.gz` write path (`get_otus_json` writes a compressed manifest patch on first request). The flag itself is not flipped by `data.py` in the current code — it's a holdover signalling whether the on-disk JSON exists. Treat as advisory. |
| `manifest` | `Record<string, int>` | yes | Map of `otu_id` → `otu_version` captured at build time via `references.db.get_manifest`. Used by `get_patched_otus` to reconstruct each OTU at the version it had when the build started. Can be very large (thousands of OTUs); excluded from the Compass schema export for that reason. |
| `reference` | `{ id: string }` | yes | Mongo `references._id`. |
| `job` | `{ id: string }` | yes | Reference to the build-index job. The live validator says `string`; new docs are written by `create_index` which calls `data.jobs.create(...)` and stores `job.id`. Postgres `jobs.id` is numeric, but the writer stringifies (or the live data is pre-numeric-jobs) — modelled as `String` to match prod and to stay consistent with `samples`/`subtractions`. |
| `user` | `{ id: number }` | yes | The user who triggered the build. Live validator still permits `string` (legacy handles); modelled as `Number` to match the post-backfill convention used in `samples` and `references`. Pre-backfill string-id docs will fail to cast — flag as a backfill prerequisite, do not loosen. |

## Authoritative side

The index **document** is Mongo-primary. The build's per-file artefacts (`reference.fa.gz`, the bowtie2 `*.bt2` family, `reference.json.gz`) are Postgres-primary in `index_files`, with the bytes in object storage. `MONGOOSE.md` lists `indexes` under "Dual-stored", but only the file artefacts are dual-stored; the index document itself is not split. `attach_files` joins the Postgres rows in at read time — they are not denormalised onto the Mongo doc.

## Quirks captured from Python

- **Versioning is count-based, not atomic.** `get_next_version` is `count_documents({reference.id, ready: true})`. Safe only because `create_index` refuses to start a new build while a non-ready one exists for the same reference. Don't replicate this naively in new code paths that bypass that check.
- **`history.index.id = "unbuilt"` is the join key for unbuilt changes.** When an index is created, `create()` rewrites every `history` doc with `index.id == "unbuilt"` for that reference to point at the new index. When an index is deleted, every `history` doc pointing at it is reset back to `{ id: "unbuilt", version: "unbuilt" }`. This is why `history.index.version` is `Mixed` — it carries either an int or the literal string `"unbuilt"`.
- **`finalize()` does work that affects `otus`.** It calls `update_last_indexed_versions` which `$set`s `last_indexed_version` on every OTU whose current `version` differs from its `last_indexed_version` for that reference. Note this when porting the OTU model — it's a write that originates from the indexes domain.
- **`get_otus_json` lazily writes `otus.json.gz` to storage.** First request after build patches every OTU in the manifest to its captured version, gzips the result, and writes it to object storage at `compose_index_file_key(index_id, "otus.json.gz")`. `has_json` does not appear to be flipped when this happens — the flag is stale; treat it as advisory only.
- **Listing has two modes.** When `ready=true`, `data.find()` runs an aggregation that joins `references` (skipping indexes whose reference no longer exists) and counts OTUs from `history`. When `ready=false`, it falls back to `db.find` which paginates and runs `IndexCountsTransform` per row. Both paths filter implicitly by reference existence (only `reference.id ∈ references.distinct('_id')`).
- **No application-managed Mongo indexes.** `virtool/mongo` does not call `create_index` on `indexes`. The query patterns that matter (and would benefit from indexes) are: `{reference.id, ready}` (most reads), `{reference.id, ready: false, limit: 1}` (build-in-progress check), and `version` desc per reference (`get_current_id_and_version`). Performance has not been a problem because the collection is small (one row per build per reference). Revisit if it grows.

## Mongoose schema

`apps/web/src/server/db/mongo/indexes.ts`. `strict: false` to round-trip legacy fields, explicit `collection: 'indexes'`, no auto timestamps.

Inferred type: `IndexDoc` (`InferSchemaType<typeof indexSchema>`).

`manifest` is typed `Schema.Types.Mixed` — Mongoose has no first-class `Map<string, number>` that round-trips cleanly through `InferSchemaType`, and the field is read as a plain object (`document["manifest"]`) by every Python consumer.

`user.id` is `Number` (post-backfill assumption, matching `samples`). `job.id` is `String` (matching the live validator and the `samples`/`subtractions` convention while jobs migrate to numeric Postgres ids).

## Open follow-ups

- `has_files` and `has_json` look effectively dead (`has_files` is always `true`; `has_json` is never flipped by the current writers). Confirm with a fresh prod scan and consider stripping during a tightening pass.
- `user.id` legacy strings need the same backfill called out in `samples.md`.
- `job.id` will likely need to become `Number` (or `Mixed` during transition) once jobs are fully on numeric Postgres ids and old build docs have been migrated.
- Add an index on `{reference.id, ready, version}` if/when listing-by-reference becomes hot; today the collection is small enough that the implicit `_id` is sufficient.
