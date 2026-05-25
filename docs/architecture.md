# Architecture

## Two backend surfaces during the migration

Virtool's backend lives in two places while we incrementally move
responsibility into this repo:

- **Legacy path** — the SPA calls the existing Python backend through
  each feature's client-side `api.ts` (superagent). Error shape is
  `error.response?.body.message`. No layering rules apply to these
  modules; they are thin HTTP wrappers and will stay that way until
  the corresponding endpoint moves.
- **New path** — TanStack Start server functions under
  `apps/web/src/server/<feature>/`, called from the SPA via the React
  Query hooks that wrap them. This is where new backend code lands and
  where Python endpoints land when they migrate.

There is no Express SSR layer anymore — `src/server/` is exclusively
TanStack Start, served by Nitro in production. Page rendering goes
through the TanStack Start / TanStack Router pipeline, with most data
still fetched via the legacy `api.ts` superagent client until the
corresponding endpoint migrates.

**Schema and migrations stay in Python.** The Python repo owns the
Alembic migration history and is the only process that applies schema
changes to Postgres or to Mongo collections. TS server features read
and write through Drizzle / the Node Mongo driver against the schema
Python defines; they don't ship their own migrations. When a migrating
endpoint needs a schema change, the change lands in Python's Alembic
tree first and the TS code follows.

Everything below — the three-file layering, the import-direction
invariant, the auth carve-out — applies to the **new path** only.
Don't retrofit it onto a feature whose backend still lives in Python;
wait until the migration of that endpoint and shape the new
`src/server/<feature>/` directory then.

### Type ownership shifts per feature as it migrates

Legacy features keep manually maintained types in their module's
`types.ts`; the Python Pydantic models are the source of truth and the
SPA copies match by convention. As a feature's backend lands in
`server/<feature>/data.ts`, prefer Drizzle inference (`InferSelectModel`,
`InferInsertModel`) over re-declaring the row shape, and re-export the
inferred types from `data.ts` so `functions.ts`, hooks, and components
share one definition. This is per-feature work — don't bulk-convert
`types.ts` files ahead of their backend migrating.

## Server modules

Server features live in `apps/web/src/server/<feature>/` and follow a
three-file layering convention. Use the exact filenames `data.ts`,
`service.ts`, and `functions.ts` — don't rename them per feature.
They're how the layering is recognised at a glance and how the
import-direction invariant stays enforceable.

- `data.ts` — pure domain layer plus persistence and external IO
  (drizzle / postgres / mongo, blob storage, outbound HTTP to upstream
  services). No framework imports. Exports domain types, typed errors
  that extend `AppError`, and the functions that read or mutate
  persistent state or call external systems. Resources (db handle,
  storage client, HTTP client) come in as explicit arguments, not
  module-scope singletons.
- `service.ts` — orchestration across multiple `data` modules, or
  cross-resource logic that doesn't fit cleanly in any one feature's
  `data.ts`. **Skip this file when the data layer covers the feature on
  its own.** Don't add `service.ts` just to have a place to put
  something — only when its absence forces ugly coupling.
- `functions.ts` — TanStack Start server function shell. Wraps
  `createServerFn` / `createServerOnlyFn`, validates input with zod,
  delegates to `data` / `service`, and maps `AppError` subclasses to
  HTTP responses via `setResponseStatus`. Should contain no business
  logic — if a handler grows a multi-step orchestration with rollbacks
  or branching, that is the signal to extract a `service.ts`.

### The underlying principle: keep policy logic pure

The three-file layering is the structural form of a broader rule:
keep decision logic separable from framework wiring. When a module
mixes validation, auth checks, business rules, or data shaping with
framework plumbing (React Query mutations, route loaders, server
handlers, DB clients, env access), the decision logic becomes hard
to test and hard to reuse. Split along the same line every time:

- A pure module exporting the decision helpers — no framework
  imports, no DB handle, no env access. Plain functions over plain
  data.
- A wired module that constructs the framework's hook / loader /
  handler and delegates to the pure helpers.

Tests target the pure module. The wired module gets exercised
through integration tests when needed, but its branching is trivial
because the real logic lives next door.

**Diagnostic that tells you the split is overdue**: a unit test
fails to *import* because a transitive dependency pulled in env
config, a DB client, or another framework concern the test does not
need. The fix is to split the module along that import-graph fault
line, not to mock the env or stub the DB. Ask "what does this file
import that the test should not have to care about?" — that is the
cut.

### Import direction

Imports flow `functions → service → data` and never the reverse.

- `data.ts` may import from `db/`, `errors.ts`, `events/`, and other
  feature `data.ts` modules — but never from `service.ts` or
  `functions.ts`.
- `service.ts` may import from any feature's `data.ts` — but never from
  `functions.ts`.
- `functions.ts` is the only layer that imports framework code
  (`@tanstack/react-start`, `@tanstack/react-start/server`).

A violation of the import direction shows up as the same diagnostic
described above: a unit test fails to *import* because a transitive
dependency dragged in TanStack Start or env config. If you see it,
the import direction has been violated.

### The labels shape (minimal)

`labels/` is the smallest valid form:

- `data.ts` — defines `Label`, `LabelValues`, `LabelNotFoundError`,
  `LabelConflictError`, and CRUD functions over the `labels` table.
- `functions.ts` — wraps each CRUD function in a TanStack Start server
  function, validates with zod, rethrows `LabelNotFoundError` as 404 and
  `LabelConflictError` as 409.

No `service.ts` — the data layer is enough.

### The auth carve-out

`auth/` is the documented exception to the three-file layout. Its
pure layer is split by primitive (`core.ts`, `session.ts`, `tokens.ts`,
`password.ts`, `cookies.ts`, `verify.ts`) and its wired layer adds a
`middleware.ts` alongside `functions.ts`. The split is finer-grained
because the primitives are distinct (crypto vs. persistence vs.
cookies vs. verification), but the principle is the same as labels:
pure below, framework wiring above.

Treat auth as a one-off shape, not a template. New features start with
the standard three-file layout and only split further if the primitives
genuinely don't fit in one `data.ts`.

## When to introduce `service.ts`

Add `service.ts` when:

- A single user-facing operation touches multiple feature `data.ts`
  modules (e.g. deleting a sample also touches analyses, jobs, and
  uploads).
- An orchestration has its own invariants — transaction boundaries,
  ordering, compensating actions — that don't belong in any one feature.
- The same multi-data-module flow is needed from more than one
  `functions.ts`.

Don't add `service.ts` for:

- Thin pass-through wrappers around a single `data.ts` function.
- Code that only exists to be called from one `functions.ts` — that's
  what `functions.ts` is for.
