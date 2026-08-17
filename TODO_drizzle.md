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

## 2. Add `drizzle.config.ts` to `packages/data` — DONE

`packages/data/drizzle.config.ts`, validated with `drizzle-kit export --sql`
(loads the config and resolves the whole schema without writing anything or
connecting). `pnpm check`, `pnpm --filter @virtool/data typecheck` and
`pnpm knip` all pass — knip's drizzle plugin treats the config as an entry,
which is what now justifies the `drizzle-kit` devDependency.

Versions confirmed a matched pair as installed: `drizzle-orm@0.45.2` and
`drizzle-kit@0.31.10`.

What it sets, and why each differs from the sketch above:

- `schema: './src/db/schema/index.ts'` — the barrel, **not** the `*.ts` glob.
  The barrel is what `createDb` types the runtime handle against, so a
  migration cannot describe something the handle doesn't have; the glob would
  also pick up `sql.ts`, which is deliberately absent from the barrel.
- `casing: 'snake_case'` — set, but the premise was wrong: all 304 column
  declarations across the 40 tables already pass an explicit name string, so
  this decides nothing today. It is a guardrail against a future column added
  without one.
- `migrations: { table: '__drizzle_migrations', schema: 'drizzle' }` — kit's
  own defaults, pinned explicitly. Step 6 stamps that row into production by
  hand, so a later default moving either name would leave the stamp orphaned
  and re-run `0000` against a database that already has every table.
- `dbCredentials.url` from `VT_POSTGRES_URL`, defaulting to `''` rather than
  throwing: `generate` (step 3) never connects, so demanding a URL there would
  be a false requirement. The connecting commands fail on the empty string.

Two supporting changes landed with it:

- `out: './drizzle'`, and `packages/data/drizzle/**` added to `biome.json`'s
  `files.includes` exclusions. drizzle-kit writes `meta/_journal.json` and the
  snapshots with 2-space indent; without the exclusion step 3's very first
  `generate` fails `pnpm check`.
- `db:generate` and `db:migrate` scripts on `@virtool/data`, so the invocation
  is canonical rather than remembered.

## 3. Generate the baseline migration — DONE

`pnpm --filter @virtool/data db:generate`, producing
`packages/data/drizzle/`:

- `0000_baseline.sql` — 572 lines.
- `meta/0000_snapshot.json` — 106 KB, the state every later generate diffs
  against.
- `meta/_journal.json` — one entry, `version: 7`, `breakpoints: true`.

Renamed from kit's generated codename (`0000_pink_wendell_vaughn`) to
`0000_baseline`: the tag is referenced only in `_journal.json` and nowhere in
the snapshot, so it is the `.sql` filename plus that one field. The
`__drizzle_migrations` row step 6 stamps carries a hash of the SQL and a
timestamp, not the tag, so this is cosmetic — but it is the history root and
gets read by hand.

`drizzle-kit check` passes ("Everything's fine"), confirming the rename left
the journal consistent. `pnpm check` and `pnpm knip` still pass, which is the
biome exclusion from step 2 doing its job — kit wrote both JSON files
2-space-indented.

First-pass sanity against `virtool-prod-schema.sql`, counts only — every
figure matches, and matches step 1's audit:

| | generated | prod dump |
| --- | --- | --- |
| tables | 40 | 40 |
| indexes | 31 | 31 |
| enum types | 4 | 4 |
| foreign keys | 54 | 54 |

Counts matching is necessary, not sufficient — step 4 is where naming,
default expressions and enum member order get read line by line.

## 4. Diff generated SQL against the prod dump — DONE

Compared object by object against `virtool-prod-schema.sql`. **One real
drift, now fixed.**

### Fixed: all 54 foreign key constraint names

Structure matched 54/54 — columns, referenced table and column, and both
referential actions. Every *name* differed, because the mirror used inline
`.references()` and let Drizzle auto-name:

```
prod: analyses_index_id_fkey             (Postgres default; Alembic never named these)
was:  analyses_index_id_indexes_id_fk    (Drizzle auto-name)
```

All 54 are now table-level `foreignKey({ columns, foreignColumns, name })`
across 15 schema files, named `{table}_{column}_fkey` — a rule every one of
them follows, `sample_reads_upload_fkey` included, whose column really is
called `upload`.

Guarded by `packages/data/src/db/schema/foreignKeys.test.ts`, which derives
the expected name for every FK in the barrel and pins the count at 54;
verified it fails when a name is reverted to Drizzle's auto-name. The rule
is in `AGENTS.md` and `docs/database.md`, since the failure mode is silent:
`0000` is stamped rather than run, so a wrong name reaches no database — it
reaches `meta/0000_snapshot.json`, and the first later migration to touch an
FK emits SQL against a constraint prod does not have.

### Clean

Enum types and member order 4/4 · indexes 31/31 · PK and unique constraints
78/78 · CHECK constraints 11/11 · identity sequence names 8/8 · columns
present and nullability, no drift · server defaults 1/1 (`jobs.acquired`) ·
bounded `varchar(n)` kept its length 6/6.

Two index caveats: `legacy_otus_name_lower` and `users_handle_lower_unique`
match only because `lower((name)::text)` ≡ `lower(name)` *given* the
varchar→text divergence below, so they are that issue resurfacing rather
than independently clean. Two others differ as `DESC` vs
`DESC NULLS FIRST`, which is genuinely the Postgres default — as is the
`ON UPDATE no action` that pg_dump omits and Drizzle spells out.

### Accepted, unchanged — with one correction to step 1

- **Unbounded `varchar` → `text` is 89 columns, not 81.** Step 1 records
  81; the real figure is 89. VIR-2986 is scoped off that number. No
  *bounded* varchar lost its length.
- `legacy_history_diff.id`'s sequence: prod `history_diffs_id_seq`, Drizzle
  `serial` emits `legacy_history_diff_id_seq`. The only one of 18 serial
  columns that disagrees. Also VIR-2986.
- `sync_instance_messages_user_id()` and its trigger are absent from the
  generated SQL entirely (VIR-2987). Invisible to the snapshot, so nothing
  will ever emit or drop them; the eventual drop is hand-written SQL.

After the fix: `0000_baseline.sql` regenerated (572 lines, 40 tables),
`drizzle-kit check` clean, `pnpm check`, `typecheck` and `knip` pass, and
`@virtool/data`'s 831 tests pass.

## 5. Rehearse the whole baseline dance against a scratch DB — DONE

Proven end to end against `postgres:18` on port 55432, restored from
`virtool-prod-schema.sql` (`--no-owner`-shaped, so it restores clean):

1. Restore → 40 tables, 54 foreign keys, 4 enum types. Matches steps 1 and 3.
2. Stamp `0000` without running it — the two statements below.
3. `pnpm --filter @virtool/data db:migrate` → "migrations applied
   successfully" having applied **nothing**: one row still in
   `drizzle.__drizzle_migrations`, still 40 tables. Kit's own
   `CREATE SCHEMA / TABLE IF NOT EXISTS` matched the hand-created table and
   passed over it with a `NOTICE`, so the DDL below is the right shape.
4. `db:generate` → "No schema changes, nothing to migrate", and
   `packages/data/drizzle/` unchanged in `git status`. No drift.

### The exact stamp (this is what step 6 runs against prod)

```sql
CREATE SCHEMA IF NOT EXISTS "drizzle";
CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
);
INSERT INTO "drizzle"."__drizzle_migrations" ("hash", "created_at")
VALUES ('b99d57f671e599f2d9a6347482eaf739c59d8a60310da84f8ff6ce9f4e5c07b9', 1786744254751);
```

The DDL is drizzle-orm's own, copied verbatim from `pg-core/dialect.js`.
`hash` is `sha256(0000_baseline.sql)` over the **whole file**, before the
`--> statement-breakpoint` split — it happens to equal plain `sha256sum`
output. `created_at` is the `when` field of `0000_baseline`'s entry in
`meta/_journal.json`, **not** a timestamp taken at stamp time: `migrate`
applies any migration whose journal `when` exceeds the newest `created_at`
in the table, so a value below 1786744254751 would re-run `0000` against a
database that already has all 40 tables. Regenerating `0000` changes both
figures.

### Never run `drizzle-kit push` anywhere near this

Discovered the hard way during the rehearsal: with stdin not a TTY, `push`
prints its "You are about to execute current statements" warning and then
**applies without prompting**. It got partway through before erroring on
`instance_messages."user"` — the VIR-2987 trigger depends on that column and
blocks a type rewrite — leaving the database half-converted. The migrate
path is unaffected and is what steps 7–8 wire up; `push` has no role in this
plan and should not acquire one.

That aborted run did yield one useful signal before it died. Its statement
list is the only *mechanical* database-vs-schema comparison taken so far —
step 4 compared file to file — and it contained nothing beyond the
divergences already accepted: the VIR-2986 `varchar`→`text` set, plus
drop-and-recreate churn on ten named PK/unique constraints whose recreated
definitions are identical to prod's. It also demonstrates that VIR-2987's
trigger will have to be dropped *before* VIR-2986's column rewrites, not
after.

## 6. Baseline real prod

Run step 5's three statements against production, verbatim. Nothing in this
step executes DDL against the application schema — it creates the `drizzle`
bookkeeping schema and one row.

## 7a. The migrate entrypoint — DONE

Three changes, all in this repo:

- `apps/tasks/src/migrate.ts` — its own two-key zod schema (`VT_POSTGRES_URL`,
  `VT_MIGRATIONS_PATH`) through the shared `resolveFileBacked`, `createDb` at
  `postgresPoolMax: 1` under `application_name` `migrate`, then `migrate()`
  with the schema and table named explicitly. Exit 0 on success, 1 on failure.
- `apps/tasks/tsdown.config.ts` — second entry, giving `dist/migrate.mjs`
  (3.5 kB).
- `Dockerfile` — `COPY --from=build-tasks /repo/packages/data/drizzle
  ./drizzle` into the `tasks` runtime stage. `pnpm deploy` carries only `dist`
  and `node_modules`, and the migrator reads the `.sql` files off disk.

Proven twice against the step-5 container:

- Against the **stamped** database: exit 0, nothing applied — still one
  migration row, still 40 tables.
- Against an **empty** database: applied `0000_baseline.sql` end to end,
  producing 40 tables, 54 foreign keys, 4 enum types and 109 indexes, and
  self-stamping `hash = b99d57f6…` / `created_at = 1786744254751`. That is the
  first time the baseline SQL has actually been executed, and it confirms
  step 6's stamp values independently — the migrator wrote by itself exactly
  what step 5 computed by hand.

`pnpm check`, `pnpm typecheck`, `pnpm knip` and `@virtool/tasks`' 172 tests
all pass.

Loose end, cosmetic: postgres.js prints its `NOTICE` payloads to stdout as raw
objects, outside the pino stream, so a run against an already-stamped database
emits two unstructured blobs about `drizzle` and `__drizzle_migrations`
already existing. Silencing them means an `onnotice` option on `createDb`.

## 7b. Wire the Job into the cluster, alongside Alembic

Model on `../kubernetes/manifests/app/ops/migration/` — a new
`manifests/app/ops/drizzle-migration/` (`job.yaml` + `kustomization.yaml`)
and its own Flux Kustomization at `clusters/production/drizzle-migration.yaml`
(copy `migration.yaml`'s shape: `dependsOn: [cluster]`, `wait: true`,
`force: true` since Jobs are immutable, `path:` pointed at the new
directory). The `app` Kustomization needs this one added to its `dependsOn`
too, same as it already depends on `migration`.

The Job runs `ghcr.io/virtool/tasks` with
`command: ["node", "dist/migrate.mjs"]` and needs only `VT_POSTGRES_URL` (or
its `_FILE` variant) in its environment — no storage credentials, no probe
port, no shutdown budget.

### Which image runs it — resolved, and it is not `drizzle-kit`

The Job does **not** need the kit CLI, the config, or the TS schema at
runtime. `migrate()` from `drizzle-orm/postgres-js/migrator` reads only
`drizzle/meta/_journal.json` and the `.sql` files off disk, creates
`drizzle.__drizzle_migrations` if absent, and applies anything whose journal
`when` exceeds the newest `created_at` — the same bookkeeping step 6 stamps.
Its whole dependency surface is `drizzle-orm` and `postgres`, both already
bundled into `apps/jobs-api` and `apps/tasks`.

So **no new image publish is required**. The cheapest shape is a second
tsdown entry on `apps/tasks` — it already builds a pool from `@virtool/data`
— plus a `COPY packages/data/drizzle` into the `tasks` runtime stage, and a
Job whose command is `node dist/migrate.mjs`. The migration SQL is already
inside the build: `base` does `COPY packages/data ./packages/data`, so every
stage has it; only the runtime stage needs the extra copy. No Dockerfile
target, no `build` matrix entry, no `release-ghcr` matrix entry.

The alternative is a dedicated `ghcr.io/virtool/migrations` image, which
costs one Dockerfile stage and two CI matrix entries. Its only argument is
legibility — the migrations belong to `@virtool/data`, which no app owns, so
hanging them off `tasks` is arbitrary coupling, and a manifest naming
`tasks:1.2.3` as the migration Job reads oddly. Take the tasks entrypoint
now; split it out if the coupling bites.

Ruled out: `apps/web`. The `ui` image is nitro `.output` plus `npm start`,
with no clean place for a second CLI entry, and it is the heaviest of the
three.

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
