# Database

The TypeScript server is **Postgres-first**: it reads and writes
Postgres only, via Drizzle. Virtool's data is still being migrated out
of Mongo, but that migration is entirely Python's concern — there is
no Mongoose / Mongo-driver layer in this repo. A domain becomes
available to the TS server when Python migrates it to Postgres, not
before.

This document is the migration-era map: who owns what today, who owns
schema changes, and the Postgres conventions a TS server feature has
to respect.

## Python owns schema and migrations

The Python repo (`../virtool`) is the only process that applies schema
changes — Alembic migrations against Postgres, and any remaining Mongo
collection changes through its own migration framework. TS server
features under `apps/web/src/server/<feature>/` read and write through
Drizzle against the Postgres schema Python defines; they don't ship
their own migrations.

When a migrating endpoint needs a schema change:

1. Land the schema change in Python's Alembic tree first. Deploy it.
2. Update the Drizzle schema in `apps/web/src/server/db/schema/` to
   match.
3. Then migrate the endpoint.

This ordering is non-negotiable as long as Python is in production —
TS code lagging the schema is fine, but Python lagging the schema
breaks the deployed app.

### Column defaults: use `.$defaultFn()`, never `.default()`

SQLAlchemy's `mapped_column(default=...)` is a **Python-side** default
applied by the ORM at insert time — it does *not* emit a `server_default`,
so the real Postgres columns have **no** server-side `DEFAULT` (there are
zero `server_default`s in the Python repo). Drizzle's `.default(value)`
assumes the opposite: on insert it emits the SQL `DEFAULT` keyword and
relies on the database to fill the column. Against these tables that
yields `null` — a not-null violation on required columns, or a silent
`null` on nullable ones.

Mirror a Python-side default with `.$defaultFn(() => value)`, which
injects the value client-side at insert time (the true analog of
SQLAlchemy's `default=`) and stays out of the DDL. Reserve `.default()`
for a column that genuinely has a `server_default` in Python.

## Domain ownership today

Snapshot of where each resource's primary record lives. "Primary"
means the source of truth — the side that gets written first and that
the other side (if any) mirrors or annotates. A TS server feature can
only be built for a domain whose primary record is in Postgres; the
Mongo-primary rows are reachable only from Python.

| Domain        | Mongo            | Postgres          | Notes                                     |
| ------------- | ---------------- | ----------------- | ----------------------------------------- |
| Users         | `legacy_id`      | **Primary**       | Fully migrated                            |
| Groups        | `legacy_id`      | **Primary**       | Fully migrated                            |
| Sessions      | —                | **Primary**       | Postgres-only                             |
| Messages      | —                | **Primary**       | Postgres-only                             |
| Tasks         | —                | **Primary**       | Postgres-only                             |
| ML Models     | —                | **Primary**       | Postgres-only                             |
| Labels        | metadata         | **Primary**       | Dual; PG authoritative                    |
| Uploads       | metadata         | **Primary**       | Dual; PG authoritative                    |
| Indexes       | metadata         | **Primary**       | Dual; PG authoritative                    |
| Samples       | **Primary**      | some fields       | Not yet available to TS                   |
| Analyses      | **Primary**      | some fields       | Not yet available to TS                   |
| OTUs          | **Primary**      | —                 | Mongo-only; not available to TS           |
| Sequences     | **Primary**      | —                 | Mongo-only; not available to TS           |
| References    | **Primary**      | —                 | Mongo-only; not available to TS           |
| HMMs          | **Primary**      | —                 | Mongo-only; not available to TS           |
| History       | **Primary**      | diffs             | Mixed; not yet available to TS            |
| Jobs          | —                | **Primary**       | Fully migrated                            |
| Settings      | **Primary**      | —                 | Mongo-only; not available to TS           |
| API keys      | **Primary**      | —                 | Mongo-only; not available to TS           |

Use this to gauge migration readiness per feature: a Postgres-primary
domain can land as a normal `data.ts` (see `labels/`). A Mongo-primary
domain is **blocked** on Python migrating it to Postgres — don't try
to reach back into Mongo to ship it early.

## Postgres-first: wait for the migration, don't reach into Mongo

The standing policy is that Python migrates a collection to Postgres
*before* the corresponding TS server functions are written. This keeps
the TS server single-store and avoids the work that a dual-store TS
layer would otherwise pull in:

- **No Mongo aggregation ports.** Samples, Analyses, OTUs, and
  References list endpoints lean on Mongo `$facet` aggregation in
  Python. Don't port those pipelines into TS — they'd only be
  rewritten again once the collection lands in Postgres.
- **No dual-store writes.** Python coordinates the rare write that
  touches both stores (`both_transactions` in `virtool/data/topg.py`).
  The TS side never opens a Mongo session; every `data.ts` works
  against a single Postgres transaction (`db.transaction(...)`).

If a domain you need is still Mongo-primary, the answer is to wait for
its Postgres migration, not to add a Mongo client back to this repo.

### Stubbed-out cross-store reads

A migrated domain occasionally exposes a field that depends on a
still-Mongo domain — e.g. a label's sample count, which needs the
samples collection. Stub these to a neutral value (`0`, empty) until
the dependency lands in Postgres, keeping the field in the response
shape so the client contract is stable. `labels/data.ts` does this:
every label reports `count: 0` until samples migrate.

## Legacy id resolution

User and group rows in Postgres carry a `legacy_id text` column that
holds the original Mongo `_id` string. Other Postgres tables that
reference a user or group may still store that reference as the legacy
string handle in some rows and the new int id in others — backfills
are not complete.

Concretely, a referencing row's `user_id` (or group reference) may be:

- a Postgres `users.id` integer (post-backfill writes), or
- a legacy Mongo handle string (pre-backfill writes).

Any query resolving such a reference must accept both forms. The
Python code does this with helpers in `virtool/data/topg.py`:

- `resolve_user_id(mongo_handle)` — look up the PG int id from a
  legacy string handle.
- `get_user_id_single_variants(id)` — given either form, return both
  forms for matching.
- `get_user_id_multi_variants(ids)` — same, for bulk queries.
- `compose_legacy_id_single_expression` /
  `compose_legacy_id_multi_expression` — build the equivalent SQL
  side.

TS port plan: when a server feature first needs legacy-id resolution,
port these into `apps/web/src/server/db/legacy_id.ts` (or similar) and
use them everywhere a `legacy_id` column is touched. Don't reinvent
per-feature.

These helpers stay relevant until the backfills are complete and the
`legacy_id` columns are dropped — likely a long time.

## If we ever own Postgres migrations from TS

Today Python owns the Postgres schema via Alembic and the TS side
mirrors it by hand (`apps/web/src/server/db/schema/`). Eventually,
once enough domains have migrated, the TS side will take over schema
ownership. Notes for that day:

- **Baseline against production.** The first `drizzle-kit generate`
  against an empty database will not be byte-identical to what Alembic
  produced. Index naming, default expressions, and enum value
  ordering all drift. Capture the live shape with `pg_dump
  --schema-only`, hand-check the generated migration against it, and
  stamp the live DB as already-applied rather than running the
  generated migration cold.
- **`casing: 'snake_case'`** in `drizzle.config.ts`. Our schema files
  use snake_case columns with camelCase TS identifiers; without this
  flag the generated migrations will rename every column.
- **Pair `drizzle-orm` and `drizzle-kit` versions.** They share
  internals and ship breaking changes together. Bumping one without
  the other has shipped silent schema-generation regressions in the
  past. Check the release notes before either bump.
