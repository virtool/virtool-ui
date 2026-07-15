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

### The harness fails loudly, so error paths are testable

`setup.tsx` calls `nock.disableNetConnect()` once per test file: any
superagent request without a matching interceptor errors instead of
falling through to the real network, where it would pass or hang
silently. A test that types into a search box or pages through a list
fires one request per resulting refetch, and each needs its own
interceptor (nock interceptors are single-use unless `.persist()`).

The test `QueryClient` (`createTestQueryClient`, used by
`wrapWithProviders`, `renderWithProviders`, and `renderRoute`) sets
`retry: false`, so a failed query surfaces its error immediately rather
than after three retries with backoff. This is what makes error-state
assertions practical — mock a `500`, render, and assert the error UI
without waiting out the retries.

The two together mean a request the test forgot to mock now shows the
error state right away instead of masking it behind retries — so
under-mocked tests fail where they used to pass by accident.

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

## Test doubles: fake, api, server-fn

The SPA's shared test doubles are split by *what they do to the system
under test*, because the three have different failure modes and a
reader needs to know which one they are looking at:

- **`src/tests/fake/`** — `createFake*` factories returning plain data.
  They mock nothing and assert nothing.
- **`src/tests/api/`** — nock interceptors standing in for Python REST
  endpoints, named `mockApi<Thing>`. They return a nock scope, and
  `scope.done()` asserts every interceptor was consumed — so an
  unfired request fails the test.
- **`src/tests/server-fn/`** — `vi.fn()` stubs over the TanStack Start
  server functions. `setup.tsx` wires each module in globally with
  `vi.mock("@server/<feature>/functions", ...)`, so a test only has to
  set a return value.

A helper belongs to exactly one of the three. Don't put a nock
interceptor in `fake/` because the generator it uses lives there —
import the generator from `api/` instead.

### Naming

A server-function mock is named `mock<ServerFnName>` after the function
it stubs, with no `Api` in the name: `mockGetAccount`, `mockFindJobs`,
`mockUpdateUser`. The name lying about the transport is what this split
exists to prevent — `mockApiGetAccount` never touched HTTP.

Each `server-fn/` file mirrors the server module it mocks, not the
client feature, because one file maps to one `vi.mock` target. So the
account mocks live in `server-fn/users.ts` — `getAccount` is exported
from `@server/users/functions` — and there is no `server-fn/account.ts`.

### Asserting a server function was called

A server-function mock returns the underlying `vi.fn()`, so assert on
it directly rather than through a nock-style scope object:

```ts
const getUser = mockGetUser(user.id, user);

renderWithProviders(<UserDetail userId={user.id} />);

await waitFor(() => expect(getUser).toHaveBeenCalled());
```

### When a domain migrates off the Python API

Python is handing domains over to the TS server one at a time. When a
feature's reads move from a REST endpoint to a server function, its
helper moves from `api/` to `server-fn/` and is renamed after the new
server function. The directory a mock lives in is therefore a live
record of which backend currently serves that domain.

Before creating a fixture, check whether one already exists. Look for
a sibling `test/` directory next to the code under test, and grep for
the fixture name or a likely export across the package. Adding a
parallel copy is the same mistake as the duplication this rule exists
to prevent.
