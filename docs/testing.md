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

For server features under `apps/web/src/server/<feature>/` once their
`data.ts` owns real persistence. Exercises schema bootstrap, indexes,
and query semantics against a real Postgres — mocks have
hidden bugs that real DBs catch.

Bootstrap the schema in a sibling `test/fixtures.ts` (see "Shared
test fixtures" below) and connect a real db handle per suite.

Today only `auth/` is on this side of the line. Add integration tests
as each feature's `data.ts` lands; don't retrofit them onto features
that still call the Python API.

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

When two or more `*.test.ts` files share the same bootstrap, seed
data, or test-double factories, extract them into a sibling
`test/fixtures.ts` module rather than copy-pasting. The cost of
duplication is silent drift — a real example: three auth test files
each carried their own copy of the schema SQL, and one of them
quietly lost the `users_handle_lower_unique` index without anyone
noticing.

Reach for extraction at the second or third copy, not later. Things
worth sharing:

- DDL / schema bootstrap (`SCHEMA_SQL`)
- Seed helpers (`seedAlice(db, hash)`)
- Test-double factories (`makeCookies()`)
- Pinned fixture constants (e.g. a known plaintext + bcrypt hash
  pair)

The shared module goes next to the tests it serves — not in a
top-level `test/` directory — so it travels with the code under test.

Before creating a fixture, check whether one already exists. Look for
a sibling `test/` directory next to the code under test, and grep for
the fixture name or a likely export across the package. Adding a
parallel copy is the same mistake as the duplication this rule exists
to prevent.
