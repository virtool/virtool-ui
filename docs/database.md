# Database

Virtool's data lives in Postgres and Mongo, with different domains
owned by each store. This document is the migration-era map: who owns
what today, who owns schema changes, and the cross-store rules a TS
server feature has to respect when it reaches into either store.

This file covers cross-cutting constraints; per-collection Mongo
shapes (document fields, validators, quirks) live in their own
per-collection files.

## Python owns schema and migrations

The Python repo (`../virtool`) is the only process that applies schema
changes — Alembic migrations against Postgres, and Mongo collection /
validator changes through its own migration framework. TS server
features under `apps/web/src/server/<feature>/` read and write
through Drizzle (Postgres) and Mongoose (Mongo) against the schema
Python defines; they don't ship their own migrations.

When a migrating endpoint needs a schema change:

1. Land the schema change in Python's Alembic / Mongo migration tree
   first. Deploy it.
2. Update the Drizzle schema in `apps/web/src/server/db/schema/` or
   the Mongoose schema in `apps/web/src/server/db/mongo/` to match.
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

Snapshot of where each resource's primary record lives, as of the
incremental migration's starting point. "Primary" means the source of
truth — the side that gets written first and that the other side (if
any) mirrors or annotates.

| Domain        | Mongo            | Postgres          | Notes                                     |
| ------------- | ---------------- | ----------------- | ----------------------------------------- |
| Users         | `legacy_id`      | **Primary**       | Fully migrated; Mongo handle retained     |
| Groups        | `legacy_id`      | **Primary**       | Fully migrated; Mongo handle retained     |
| Sessions      | —                | **Primary**       | Postgres-only                             |
| Messages      | —                | **Primary**       | Postgres-only                             |
| Tasks         | —                | **Primary**       | Postgres-only                             |
| ML Models     | —                | **Primary**       | Postgres-only                             |
| Labels        | metadata         | **Primary**       | Dual; PG authoritative                    |
| Uploads       | metadata         | **Primary**       | Dual; PG authoritative                    |
| Indexes       | metadata         | **Primary**       | Dual; PG authoritative                    |
| Samples       | **Primary**      | some fields       | Heavy Mongo aggregation                   |
| Analyses      | **Primary**      | some fields       | Heavy Mongo aggregation                   |
| OTUs          | **Primary**      | —                 | Mongo-only                                |
| Sequences     | **Primary**      | —                 | Mongo-only                                |
| References    | **Primary**      | —                 | Mongo-only                                |
| HMMs          | **Primary**      | —                 | Mongo-only                                |
| History       | **Primary**      | diffs             | Mixed; Mongo headers, PG diff blobs       |
| Jobs          | —                | **Primary**       | Fully migrated                            |
| Settings      | —                | **Primary**       | Fully migrated                            |
| API keys      | **Primary**      | —                 | Mongo-only                                |

Use this to gauge migration cost per feature: a Postgres-only domain
can land as a normal `data.ts` (see `labels/`); a Mongo-only or
dual-owned domain pulls in the rules in the rest of this file.

## Legacy id resolution

User and group rows in Postgres carry a `legacy_id text` column that
holds the original Mongo `_id` string. Every Mongo collection that
references a user or group still stores that reference as the legacy
string handle in some documents and the new int id in others —
backfills are not complete.

Concretely, a Mongo document's `user.id` (and `groups[]` items) may
be:

- a Postgres `users.id` integer (post-backfill writes), or
- a legacy Mongo handle string (pre-backfill writes).

This means any query joining from Mongo to Postgres must accept both
forms. The Python code does this with helpers in `virtool/data/topg.py`:

- `resolve_user_id(mongo_handle)` — look up the PG int id from a
  legacy string handle.
- `get_user_id_single_variants(id)` — given either form, return both
  forms for `$in` matching.
- `get_user_id_multi_variants(ids)` — same, for bulk queries.
- `compose_legacy_id_single_expression` /
  `compose_legacy_id_multi_expression` — build the equivalent SQL
  side.

TS port plan: when a server feature first needs cross-store id
resolution, port these into `apps/web/src/server/db/legacy_id.ts` (or
similar) and use them everywhere a `legacy_id` column or a `user.id` /
`groups[]` Mongo field is touched. Don't reinvent per-feature.

These helpers stay in the codebase until the backfills are complete
and the `legacy_id` columns are dropped — likely a long time.

## Dual-store writes (not yet needed in TS)

Python coordinates writes that touch both stores through
`both_transactions` in `virtool/data/topg.py`. It opens a Motor
session and a SQLAlchemy `AsyncSession`, rolls both back on any
throw, and retries on transient Mongo errors.

No TS server feature writes to both stores today. `auth/` and
`labels/` are Postgres-only. When the first dual-write feature
migrates:

- Postgres side: Drizzle transaction (`db.transaction(...)`).
- Mongo side: Node Mongo driver `session.withTransaction(...)`.
- Outer try / rollback-both on throw. Port the retry-on-transient
  logic — Mongo Node driver transactions have different retry
  semantics than Motor; verify against the Python behaviour rather
  than copying the code.

Until that day, Python remains the only process doing dual writes,
and the TS side is free to assume single-store transactions in its
`data.ts`.

## Mongo aggregation pipelines

Samples, Analyses, OTUs, and References use Mongo aggregation
(`$facet` for filter + sort + paginate in one round-trip) on their
list endpoints. There is no clean SQL equivalent, and the Node Mongo
driver's aggregation API differs from Motor's.

When migrating one of these endpoints, you have two choices per
pipeline:

- Port the pipeline as-is using the Node driver. Read-heavy and tedious
  but mechanical.
- Leave the endpoint in Python until the underlying collection
  migrates to Postgres. Often the right call — porting a Mongo
  aggregation only to rewrite it again post-Postgres-migration is
  wasted work.

Flag this in the migration plan for any Mongo-primary domain. Don't
discover it mid-port.

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
