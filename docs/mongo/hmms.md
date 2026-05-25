# hmms

Hidden Markov Model annotations used by the NuVs analysis workflow. Each document describes a single HMM cluster — the per-cluster metadata (names, length, entropy) and the per-family/per-genus virus counts that produced it.

> **Collection name.** The Mongo collection is `hmm` (singular). The Python code binds it as `mongo.hmm`. The Mongoose model passes `collection: 'hmm'` to keep this exact.

## Source

- Python module: `virtool/hmm/{db,data,models,api,tasks,utils}.py`
- Pydantic models: `virtool/hmm/models.py` (`HMM`, `HMMMinimal`, `HMMSequenceEntry`)
- Live schema: production `$jsonSchema` from Compass (supplied during port).

## Document shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `_id` | `string` | yes | Server-generated cluster id (not an ObjectId). Referenced by NuVs analysis hits as `hit.hit`. |
| `cluster` | `int` | yes | Numeric cluster index. Used as the default sort key in `find()`. |
| `count` | `int` | yes | Number of sequences that contributed to the cluster. |
| `entries` | `HMMSequenceEntry[]` | yes | Per-sequence provenance: `{ accession, gi, name, organism }`. All four sub-fields are required strings on every entry. |
| `families` | `{ [family: string]: int }` | yes | Open-ended map of virus family → count. Keys include real taxon names plus the literal string `"None"` for unclassified contributors. |
| `genera` | `{ [genus: string]: int }` | yes | Same shape as `families` but at the genus level. Also includes a `"None"` bucket. |
| `hidden` | `boolean` | yes | Filter flag. Listing endpoints always pass `{ hidden: false }` as the base query. |
| `length` | `int` | yes | Profile length in residues. |
| `mean_entropy` | `double` | yes | |
| `total_entropy` | `double` | yes | |
| `names` | `string[]` | yes | Up to three human-readable names. Pydantic `HMM` validator enforces `len(names) <= 3`; the Mongoose schema does not re-enforce this — the bound is on the writer (`install()` from a release annotations file), not on the storage layer. |

The live `$jsonSchema` lists every family/genus key explicitly. We model these as open-ended `Map<String, Number>` fields rather than baking the enum in: new taxa get added when HMM releases are regenerated, and the keys are user-presentation strings, not a closed set the data layer cares about.

## Authoritative side

HMMs are **Mongo-only**. There is no Postgres mirror. Documents are wholly produced from a downloaded release archive (`HMMInstallTask` → `HmmsData.install()`), which inserts annotations one by one inside a Mongo session that also writes the profiles file to storage. There is no in-app editing of HMM documents.

## Quirks captured from Python

- `find()` filters `{ hidden: false }` as a base query, then optionally regex-matches `names`. Sort is `cluster` ascending.
- The list projection (`HMMS_PROJECTION`) is `["_id", "cluster", "names", "count", "families"]` — `entries`, `genera`, `length`, `mean_entropy`, `total_entropy`, and `hidden` are not returned by the list endpoint. This is a read concern; storage still keeps the full document.
- HMM ids are referenced from NuVs analyses two ways: `analyses.results.orfs.hits.hit` (when results are inline) and inside per-analysis JSON result files written to storage. Garbage-collection (`get_referenced_hmm_ids`) reads both sources.
- `generate_annotations()` dumps every HMM document to JSON via `base_processor` (renames `_id` → `id`) and caches the gzipped result at `hmm/annotations.json.gz` in storage.
- Status (release metadata, install progress, errors) lives in the `status` collection under `_id: "hmm"`, **not** here. That's a separate document keyed by name and isn't part of this schema.
- Indexes: no application-managed Mongo indexes on this collection beyond the implicit `_id`. The `find()` path scans with the `hidden` filter and sorts by `cluster` in-memory/cursor.

## Mongoose schema

`apps/web/src/server/db/mongo/hmms.ts`. Uses `strict: false` so any future fields added by upstream HMM releases round-trip without loss, and explicit `collection: 'hmm'` to match the live name. `families` and `genera` are typed as `Map<String, Number>` — Mongoose preserves arbitrary keys this way and `InferSchemaType` produces a `Map<string, number>`.

Inferred type: `HMMDoc` (`InferSchemaType<typeof hmmSchema>`).

## Open follow-ups

- The `names` length-≤3 invariant is currently enforced only at the API/model boundary in Python. If we want it enforced on writes from the new app, add a `validate` to the schema once the install path is ported — not now, because legacy docs may violate it.
- `HMMS_PROJECTION` differs from the full document in a way worth re-checking when porting the list endpoint: the client doesn't expect `genera`/`entries`/entropy fields in the list response.
