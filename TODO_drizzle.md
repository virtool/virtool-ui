# TODO: Drizzle takes over Postgres migrations from Alembic

Prerequisite: a schema-only `pg_dump` of production, tracked separately in
`../kubernetes/TODO.md`. Everything below assumes that dump exists locally.

Background: today Python owns the Postgres schema via Alembic
(`../virtool/assets/alembic/`), and `packages/data/src/db/schema/` mirrors it
by hand — see `docs/database.md`'s "Python owns schema and migrations" and
"When we own Postgres migrations from TS" sections, which this plan carries
out. This is a cutover, not a swap: both Alembic and Drizzle stay wired into
the cluster briefly, one silent no-op deploy proves the new path before the
old one is removed — same shape as the tasks/jobs-api cutovers.

## 1. Confirm schema parity — DONE

Diff the prod dump against `packages/data/src/db/schema/` by hand — every
table, index, constraint, default, and the three historical `pgEnum`
declarations (`messagecolor`, `indextype`, `session_type_enum`) that are
`text` + CHECK in reality. This has to be true regardless of what order
anything else happens in.

Result: all 40 production tables now mirrored, verified mechanically —
column sets, nullability, types, every named primary key, unique, check and
index, all 54 foreign keys and their cascades, all four enum types and their
member order, and the one real server default (`jobs.acquired`). Four
divergences were found and are recorded rather than fixed here:

- `legacy_history_diff`'s primary key name (`history_diffs_pkey`) — fixed,
  it is now pinned explicitly like its sibling unique constraint.
- The six tables nothing in this repo reads or writes are now declared, in
  `migrations.ts` and `vestigial.ts`, so they reach the snapshot. Dropping
  them post-cutover is VIR-2985.
- 81 unbounded `varchar` columns are `text()` in the mirror, and
  `legacy_history_diff`'s sequence keeps its pre-rename name. Both are inert
  because `0000` is stamped rather than run — VIR-2986.
- The `instance_messages` user-sync trigger and function have no Drizzle
  representation. Already a no-op on every write either side makes; dropping
  it is VIR-2987.

## 2. Add `drizzle.config.ts` to `packages/data`

Doesn't exist yet (`drizzle-kit` is already a dependency, the config isn't).
Needs:

- `casing: 'snake_case'` — our schema files use snake_case columns with
  camelCase TS identifiers; without this every generated migration renames
  every column.
- schema glob pointing at `src/db/schema/*.ts`.
- `dbCredentials` sourced from env, not hardcoded.
- Confirm `drizzle-orm` (`^0.45.2`) and `drizzle-kit` (`^0.31.10`) are a
  matched pair before touching either version — they share internals and
  have shipped breaking generation regressions when bumped independently.

## 3. Generate the baseline migration

`drizzle-kit generate` from the current hand-written schema → produces
migration `0000` (the "create everything" SQL) plus `meta/_journal.json`.
This becomes the repo's migration history root.

## 4. Diff generated SQL against the prod dump

Index naming, default expressions, and enum value ordering are known to
drift between what Alembic produced and a fresh Drizzle generate (see
`docs/database.md`). Hand-check line by line; resolve any real drift in the
Drizzle schema *before* baselining — the generated migration must describe
prod exactly, since it's about to be stamped as already-applied rather than
run.

## 5. Rehearse the whole baseline dance against a scratch DB

Never touch real prod until this is proven end to end:

1. Restore the prod dump into a throwaway Postgres instance.
2. Create `__drizzle_migrations` (default table/schema:
   `drizzle.__drizzle_migrations`) and insert a row for migration `0000`
   marking it applied, *without* running its SQL — same effect as
   `drizzle-kit pull --init` gives you for an introspected schema, applied
   here to the migration we actually generated in step 3, since `pull`
   would overwrite our hand-curated schema.ts with an introspected one.
3. Confirm `drizzle-kit migrate` then reports nothing pending.
4. Confirm a fresh `drizzle-kit generate` against the current schema
   produces an empty diff (no drift).

## 6. Baseline real prod

Repeat step 5.2 against production once the rehearsal is clean: create
`__drizzle_migrations` and stamp migration `0000` as applied. Nothing in
this step executes DDL against prod.

## 7. Wire `drizzle-kit migrate` into the cluster, alongside Alembic

Model on `../kubernetes/manifests/app/ops/migration/` — a new
`manifests/app/ops/drizzle-migration/` (`job.yaml` + `kustomization.yaml`)
and its own Flux Kustomization at `clusters/production/drizzle-migration.yaml`
(copy `migration.yaml`'s shape: `dependsOn: [cluster]`, `wait: true`,
`force: true` since Jobs are immutable, `path:` pointed at the new
directory). The `app` Kustomization needs this one added to its `dependsOn`
too, same as it already depends on `migration`.

Open question to resolve before writing the Job: which image runs
`drizzle-kit migrate`? `packages/data` ships no `dist` (packages stay
source), so this has to run from one of the bundled apps — most naturally a
small migrate entrypoint added to `apps/web`'s image, invoked with a
distinct command/arg the way the existing job runs
`["virtool", "migration", "apply"]`. Decide this before step 7, not during.

Credentials: reuse the existing `virtool` ServiceAccount and
`virtool-secrets` SecretProviderClass exactly as `migration/job.yaml` does —
don't mint new plumbing.

## 8. Ship one deploy with both jobs live

Alembic does its real work; `drizzle-kit migrate` runs and finds nothing
pending (because of the step-6 baseline). Confirms the new Job behaves in
the actual cluster before it's load-bearing.

## 9. Cut Alembic out

Once step 8 is confirmed clean:

- Remove `manifests/app/ops/migration/` and its Flux Kustomization
  (`clusters/production/migration.yaml`) from `../kubernetes`, and drop
  `migration` from the `app` Kustomization's `dependsOn`.
- Flip `docs/database.md`'s "Python owns schema and migrations" section (and
  anywhere `AGENTS.md` states that rule) in the same commit — this repo's
  own doc-staleness rule.
- Leave `../virtool/assets/alembic/versions/` alone as history — don't
  delete it.

## 10. Aftermath

`packages/data/src/db/schema/` stops being a hand-maintained mirror and
becomes the actual source of truth. Every future schema change is a Drizzle
migration generated and reviewed in this repo, landed before the code that
depends on it — the same ordering discipline `docs/database.md` already
states for the Alembic-first world, just with the owner flipped.
