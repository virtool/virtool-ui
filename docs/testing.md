# Testing

## Layers

Two layers, picked by what the code under test actually touches.

### Unit — Vitest, mocked at the boundary

The default. Fast, runs on every save. Covers:

- React components and hooks — render with `renderWithProviders` or
  `renderWithRouter` from `apps/web/src/tests/setup.tsx`.
- Pure helpers — `@app/utils`, validation, transforms, and `data.ts`
  domain functions that take `db` as a parameter. Pass a fake or
  in-memory db handle; no framework, no real I/O.

### Integration — Vitest against a real database

For server features under `apps/web/src/server/<feature>/` whose code
owns real persistence: exercising schema bootstrap, indexes, and query
semantics against a real Postgres, since mocks hide bugs that real DBs
catch. A session check that forgets to filter on `users.active` passes
against a stubbed query builder and fails against Postgres.

`src/tests/globalSetup.ts` starts one Postgres container for the
`server` project and exports `VT_POSTGRES_URL`. It is wired only into
that project: the `web` project's jsdom tests never reach Postgres,
because the client transform strips server function bodies along with
the server-only imports behind them. Component tests therefore run
without Docker. Call `createTestDatabase()` from
`@server/db/test/fixtures` in `beforeAll` to get an isolated database
with the schema already applied, and `drop()` it in `afterAll`:

```ts
let database: TestDatabase;

beforeAll(async () => {
    database = await createTestDatabase();
}, 60_000);

afterAll(async () => {
    await database.drop();
});
```

Each call creates its **own** database, because Vitest runs test files
in parallel workers against that single container — sharing `public`
would let one file's seed data and truncations leak into another's.

The schema is materialized by diffing the Drizzle schema against an
empty one with `drizzle-kit`, so it tracks `src/server/db/schema/`
automatically and there is no second copy of the DDL to keep in step.
`drizzle-kit` is a test-only dependency and this is **not** a migration
path — Python still owns the real schema, and nothing here is ever
pushed at a real database.

`auth/verify.test.ts` is the worked example. Add integration tests as
each feature's persistence lands; don't retrofit them onto features
that still call the Python API.

### Testing a server function's handler

A test **cannot** call a server function by importing it and invoking
it. The Vite plugin splits every `createServerFn` in two: the module you
import keeps only a client stub, and the handler body moves into a
virtual `?tss-serverfn-split` sibling. Calling the import runs none of
your code — it either throws `No Start context found in
AsyncLocalStorage` or quietly resolves `undefined`. A test written the
obvious way passes while asserting nothing, which for an authorization
test is worse than having no test.

Import the split module and call the handler through `callServerFn` from
`@server/test/serverFn`:

```ts
const handlers = (await import(
    "./functions.ts?tss-serverfn-split"
)) as SplitServerFnModule;

await expect(
    callServerFn(handlers, "deleteGroup", { groupId }),
).rejects.toBeInstanceOf(ForbiddenError);
```

This runs the real handler: its validator, its authorization guard, and
its `data.ts` calls against the test database. `callServerFn`
deliberately runs it *without* the global authentication middleware, so
what a test pins is the handler's own guard — which is the thing that
must not regress.

Mock `@tanstack/react-start/server` to capture `getRequest` and
`setResponseStatus`, then drive authentication by pointing `getRequest`
at a `Request` carrying the session cookies from `seedUser` / `seedSession`
(`@server/auth/test/fixtures`). `groups/functions.test.ts` is the worked
example.

## Where to mock the network boundary

The right boundary depends on whether the feature has migrated from
the legacy Python API to TanStack Start server functions.

**Legacy AJAX features** — most of the SPA today. The browser calls
Python through `@app/api.ts` and per-module `api.ts` (superagent).
Mock at the HTTP boundary using the fakes and API mocks in
`apps/web/src/tests/`.

**Migrated server-function features.** There is no HTTP boundary from
the SPA's perspective — the server function is a typed call. Mock at
the `data.ts` interface or stub the db handle. Don't reintroduce an
HTTP mock just to keep the test shape familiar.

If a feature is half-migrated, mock at whichever boundary the code
path under test actually crosses.

## Don't snapshot response shapes

Inferred zod / TS types already pin response shapes; a snapshot adds
a second source of truth that drifts. Keep explicit `expect()`
assertions on the fields the test actually cares about.

Snapshot only when the output is genuinely complex transformed text
(rendered markdown, a generated report) and the assertion would
otherwise be unreadable.

## Queries and disambiguation

Prefer accessible queries (`getByRole`, `getByLabelText`) over
`getByTestId`. Every interactive element should be reachable by an
accessible name — visible label, `aria-label`, or `aria-labelledby`.
If a query is ambiguous, give the target a name in the component
rather than disambiguating in the test; the test stays stable as the
surrounding UI changes.

**Don't disambiguate by index.** Reaching into `getAllByRole(...)[n]`
to pick between *different* controls (e.g. one of several buttons) is
fragile — adding or reordering controls silently picks up the wrong
one. Add an accessible name instead. Indexing into a list of
intrinsically ordered, equivalent items (rows in a table, cards in a
list) is fine.

## Shared test fixtures

When two or more test files share the same bootstrap, seed data, or
test-double factories, extract them into a shared module next to the
tests it serves rather than copy-pasting. The cost of duplication is
silent drift: each copy is free to fall out of step with the others,
and the one that does is the one nobody re-reads.

Reach for extraction at the second or third copy, not later. Things
worth sharing: schema bootstrap, seed helpers, test-double factories,
and pinned fixture constants (e.g. a known plaintext + hash pair).

The shared module goes next to the tests it serves — not in a
top-level `test/` directory — so it travels with the code under test.
Cross-cutting fakes for the SPA are the exception; those already live
in `apps/web/src/tests/fake/`.

Before creating a fixture, check whether one already exists. Look for
a sibling `test/` directory next to the code under test, and grep for
the fixture name or a likely export across the package. Adding a
parallel copy is the same mistake as the duplication this rule exists
to prevent.
