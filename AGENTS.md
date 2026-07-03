# Virtool UI

React + TypeScript single-page application for Virtool, a bioinformatics platform.

> `CLAUDE.md` is a symlink to this file. Edit `AGENTS.md` — never write to
> `CLAUDE.md` directly.

## Repository layout

This is a **pnpm monorepo**:

- `apps/web/` — the Vite SPA (formerly the top-level repo). All UI code lives
  here.
- `packages/` — shared, framework-agnostic libraries published as workspace
  packages:
  - `@virtool/config` — zod-validated environment schema
  - `@virtool/logger` — pino wrapper, server-side log defaults and
    `child({...})` pattern
  - `@virtool/bio` — sequence utilities (complement, translation, etc.)
  - `@virtool/contracts` — zod-validated cross-process data shapes
  - `@virtool/sentry` — shared Sentry option helpers (node + browser entry
    points)

Use `pnpm` for all install, run, and exec commands — not `npm` or `bun`.

## Documentation

`AGENTS.md` is the index. It carries the rules an agent needs to
start work — terse statements with pointers into `docs/` for the
full treatment. Detailed explanations, examples, and rationale live
in `docs/`.

**`docs/` files are self-contained leaves.** Each doc covers one
topic end-to-end and does not link to or reference other docs.
Routing between topics is `AGENTS.md`'s job, not the docs'. If you
find yourself wanting to write "see other-doc.md", either the detail
belongs in `AGENTS.md` as the routing layer, or the two docs need to
be reorganised so each is complete on its own.

**When to update what:**

- New behavioural rule or convention → add a one-line statement in
  the right `AGENTS.md` section and put the detail in the matching
  `docs/<topic>.md`. Create a new doc only when no existing one
  covers the area.
- Change to behaviour described in a doc → update the doc in the
  same commit. `docs/` goes stale the moment the code it describes
  changes.
- A section in `AGENTS.md` keeps growing → move the detail into a
  doc and leave a one-or-two-line pointer behind.
- A doc grows past one cohesive topic, or starts pulling in
  unrelated material to stay self-contained → split it along the
  mixed-concerns line so each half is again a leaf.

## Package manager

This repo uses **pnpm**. Common commands:

```bash
pnpm install                      # install everything (root + apps + packages)
pnpm -r test                      # run every package's tests
pnpm -r typecheck                 # typecheck every package
pnpm check                        # biome check (whole repo)
```

## Tooling

### Commands (from repo root)

| Task | Command |
| --- | --- |
| Typecheck | `pnpm typecheck` |
| Lint + format | `pnpm check` |
| Format only | `pnpm format` |
| Test (single run, all packages) | `pnpm test` |
| Test (filtered) | `pnpm --filter @virtool/web exec vitest run src/path/to/file` |
| Build | `pnpm build` |

Don't use the dev server. Live development is done using Tilt and Minikube and is
currently configured in another repository.

### When to run checks

- After changing behavior covered by a `docs/` file: update that file
  in the same commit (see Documentation above).
- After changing route files in `apps/web/src/routes/`: run
  `pnpm --filter @virtool/web exec tsr generate` (or the equivalent
  `@tanstack/router-cli generate`) to regenerate
  `apps/web/src/routeTree.gen.ts` before running type checks.
- `apps/web/src/routeTree.gen.ts` is checked in. If it shows up in
  `git status` — even when it looks like unrelated drift from a
  regen — commit it alongside your other changes. Never leave it
  out of a commit.
- Before committing: `pnpm check` and `pnpm typecheck`.
- After changing tests: run the specific test file with
  `pnpm --filter @virtool/web exec vitest run <path>`.
- Full test suite only when asked or when changes are cross-cutting.
- Always fix all lint errors. Biome's lint rules are all set to `error` in
  `biome.json` (there are no warn-level rules), and CI's `check-biome` job runs
  `pnpm check` — so `pnpm check` must exit 0 before merging. The main branch is
  guaranteed to pass `pnpm check` cleanly, so any issues are caused by your
  changes — never dismiss them as pre-existing.
- Always assume tests pass on `main` — CI enforces it. Any test failures you
  see locally are caused by your changes, never pre-existing. Do **not** use
  `git stash` (or any other working-tree-modifying command) to "check what
  main looks like" — that risks dropping uncommitted work. Just trust that
  main is green and debug your own changes.

## Architecture

### Web app (`apps/web/`)

Source lives in `apps/web/src/`. Each top-level directory is a feature
module:

- `src/account/` - User account management
- `src/administration/` - Admin settings
- `src/analyses/` - Analysis workflows
- `src/app/` - App shell, routing, theme, shared utilities
- `src/base/` - Shared UI components (buttons, dialogs, forms, tables, etc.)
- `src/forms/` - Form components and patterns
- `src/groups/` - User groups
- `src/hmm/`, `src/indexes/`, `src/ml/` - Bioinformatics features
- `src/otus/`, `src/sequences/`, `src/references/`, `src/samples/` - Core data
  models
- `src/subtraction/` - Subtraction management
- `src/labels/`, `src/jobs/`, `src/uploads/` - Supporting features
- `src/nav/` - Navigation
- `src/server/` - TanStack Start server features (server functions,
  middleware, db, auth) — the new path for backend responsibility
  migrating into this repo
- `src/tests/` - Test setup, fakes, and API mocks
- `src/types/` - Shared type definitions

### Path aliases

Every feature directory has a `@name` alias (e.g., `@app/utils`, `@base/Button`,
`@samples/queries`). The catch-all `@/*` maps to `apps/web/src/*`. Prefer
specific aliases over `@/`.

### Key libraries

- **React 19** with React Compiler (babel plugin)
- **TanStack Router** for routing
- **React Query** (`@tanstack/react-query`) for server state
- **zustand** for client state
- **react-hook-form** + **zod v4** for forms and validation
- **superagent** for API calls (via `@app/api.ts` client)
- **styled-components** for CSS-in-JS (legacy, still in use)
- **Tailwind CSS v4** for utility styles (preferred for new code)
- **Radix UI** primitives for accessible components
- **CVA** (`class-variance-authority`) for component variants
- **Lucide React** for icons

### TanStack Router search params

Zod v4 schemas can be passed directly to `validateSearch` — `@tanstack/zod-adapter`
is not needed. Use `.default()` and `.catch()` for defaults and fallbacks.

### Routing: in-app navigation uses `<Link>`

Internal links use `<Link>` from `@tanstack/react-router`. A plain `<a>` to an
internal route triggers a full page reload. For query strings, use `search` on
`<Link>` — don't add an `href` escape hatch to link wrappers.

`<a>` is only for external URLs and deliberate full reloads.

### API calls

Use the superagent-based client in `apps/web/src/app/api.ts`. API errors have
the shape `error.response?.body.message`.

Each feature owns a `queries.ts` module that folds its request logic directly
into React Query hooks and `queryOptions`/`*QueryKeys` factories — there is no
separate per-feature `api.ts` layer. Inline each `apiClient` call into the
hook's `queryFn`/`mutationFn`; keep a module-private helper only when a request
is shared across hooks or branches. Route loaders prefetch via the same
`queryOptions` factories where appropriate.

Loading and error states come in two tiers: primary route data uses
`useSuspenseQuery` (loading via the route's `<Suspense>`, errors via the
router's `defaultErrorComponent`, `@base/RouteError`), and secondary data
stays on `useQuery`, gating an inline `@base/QueryError` on `isError && !data`
(error only when there's nothing to show, so stale data survives a failed
background refetch) before checking `isPending`. Never write
`if (isPending || !data)` — that puts `!data` in the loading branch, so an
initial-load failure spins forever. See
[docs/queries.md](docs/queries.md) for the query-key, `queryOptions`,
route-loader prefetch, the two-tier error/loading policy, and mutation
patterns.

### Styling

- Use Tailwind utility classes for new code.
- Use the `cn()` function from `@app/utils` for conditional classes (combines
  `clsx` + `tailwind-merge`).
- Don't use arbitrary Tailwind classes like `max-h-[210px]`.
- Existing styled-components are fine to maintain; prefer Tailwind for new work.
- Design tokens and theme are in `apps/web/src/app/theme.ts`. Check there
  before inventing colors or spacing values.
- Tailwind theme customization is in `apps/web/src/app/style.css` via
  `@theme`.

### Base component color props

Base components in `src/base/` that expose a `color` prop should accept the
shared palette: `"blue" | "green" | "gray" | "orange" | "purple" | "red"`. Don't
add one-off colors or trim the set per component — keep the surface uniform.

If a component has multiple variants (e.g. `solid` / `soft`), `color` should
work in every variant. A variant that silently ignores `color` is a footgun;
either honor it across the board or drop the prop for that variant.

### Server modules layer as `data.ts` → `service.ts` → `functions.ts`

New TanStack Start server features under `apps/web/src/server/<feature>/`
use a three-file layering: `data.ts` (pure domain + persistence /
external IO), optional `service.ts` (cross-`data` orchestration), and
`functions.ts` (TanStack Start shell, zod validation, error mapping).
Imports flow `functions → service → data` and never the reverse. The
db handle is injected as the first argument to `data.ts` functions,
not imported.

Legacy features that still call the Python API through their
client-side `api.ts` are not subject to this layering.

See [docs/architecture.md](docs/architecture.md) for the import-direction
invariant in full, the labels (minimal) and auth (carve-out) shapes,
the pure-policy-vs-framework-shell principle, and when to introduce
`service.ts`.

### Client-reachable files import server modules via `@server/*`

`apps/web` type-checks as two projects (`pnpm typecheck` runs both):
`tsconfig.server.json` (Node types) for `src/server`, and
`tsconfig.app.json` (DOM lib, no Node types) for browser code, which
resolves `@server/*` to the server project's emitted declarations.

Any file reachable from the browser program — including framework
entries pulled in by `routeTree.gen.ts`, like `start.ts` — must import
server modules through the `@server/*` alias, never a relative
`./server/*` path. A relative import bypasses the declaration remap and
drags the server source graph (and `@types/node` globals) back into the
browser program.

### Authentication is enforced by global middleware

Every TanStack Start server function is authenticated by default.
Public endpoints opt out by being passed as **server-function
references** to the middleware's `exceptions` array, not by
per-handler guards. The resolved session lands on `context.session`.
Raw `Request` handlers in `createFileRoute` (e.g. SSE routes) call
`requireAuthenticatedRequest(request)` instead, because they run
outside the server-function async-local context.

See [docs/auth.md](docs/auth.md) for the middleware composition, the
session model, cookies, lifetimes, and the login / reset / logout
flows.

### Data store: Postgres-first

The TypeScript server reads and writes **Postgres only** (via
Drizzle). Python is the sole owner of schema and migrations — TS code
reads and writes against the schema Python defines. Mirror Python-side
column defaults with Drizzle `.$defaultFn()`, never `.default()` —
the real columns have no `server_default`, so `.default()` inserts
`null`.

Virtool's data is still being migrated out of Mongo by Python.
Domains that have not yet landed in Postgres (OTUs, sequences,
references, samples, and the rest) are simply not available from the
TS server yet — there is no Mongoose / Mongo-driver layer here. Wait
for Python to migrate a domain to Postgres before building its TS
server functions, rather than reaching back into Mongo.

See [docs/database.md](docs/database.md) for the per-domain
ownership table, the `legacy_id` resolution rules, and the
column-default convention.

### Server → client push runs over SSE with id-only frames

Server-pushed cache invalidations are delivered over a single SSE
stream at `/events`. Each frame carries `{ domain, operation, id }`;
the client invalidates React Query caches by `domain` and refetches
through the REST API so per-user auth is
enforced on the refetch instead of in a fanout broadcast. Both
Python and Node publish onto the Postgres `client_events` channel;
`routes/events.ts` is the sole consumer.

See [docs/server-push.md](docs/server-push.md) for the wire format,
auth on the SSE side, and the follow-up TODOs.

## Projects

Ongoing projects are documented in `docs/projects/`. These correspond to Linear
projects. If your task relates to a project, check that directory for
constraints, mappings, or decisions that apply to your work.

- **Remove styled-components**: `docs/projects/remove-styled-components.md`

## Linear

- **Team**: Virtool
- **Team ID**: `76cf3c46-c5d9-4df4-b457-0fc053d402f7`
- **Issue prefix**: `VIR`
- **Default label**: Frontend

### Issue conventions

- Capitalize issue titles.
- Place issues in **Todo** by default; use **Backlog** only when explicitly
  asked. If an issue seems like it should be Backlog, say so and ask.
- Never assign issues to anyone.
- Label bugs as **Bug** in addition to any other labels.

## Code style

The basics:

- **Functions:** Use function declarations, not arrow functions
  (`func-style` enforced).
- **Imports:** Biome organises imports automatically.
- **Conditionals:** Always use curly braces with `if`/`else`.
- **Prefer `const`** over `let`.
- **Types:** Use `type`, not `interface` (unless declaration merging
  is required). Prefer string literal unions over `enum`.
- **JSDoc:** Every exported `type` gets a one-line `/** ... */`.
- **Naming:** `is`/`has`/`get` for pure reads; `check`/`validate`/
  `assert` for may-throw. Don't suffix exports with their layer
  (`Fn`, `Core`, `Handler`, `Impl`).
- **Comments:** Default to none. Document *why* when non-obvious, not
  *what*.
- **Concurrency:** Independent awaits go in `Promise.all` — don't pay
  the sum of latencies.

See [docs/code-style.md](docs/code-style.md) for the full TypeScript,
naming, comments, and concurrency rules with examples.

## Configuration

### Environment variables are prefixed with `VT_`

Every Virtool-owned env var must start with `VT_`. The prefix keeps our
variables clearly separated from third-party ones (`SENTRY_*`, `NODE_*`,
cloud-provider injected vars) and matches the `envPrefix` Vite is configured
to expose. This applies to schema keys in `packages/config/src/`,
`.env.example`, and any `process.env.*` reads anywhere in the app.

Good: `VT_WORKER_MODE`, `VT_WORKER_CONCURRENCY`, `VT_POSTGRES_URL`.

Bad: `WORKER_MODE`, `POSTGRES_URL`.

The only exception is upstream-defined names (e.g. `SENTRY_AUTH_TOKEN`,
`NODE_OPTIONS`) — leave those as the third party expects.

## Logging

Server code logs through `@virtool/logger`, not `console.*`. Build child
loggers with `ctx.logger.child({...})` to attach scoped context (request id,
job id, user id) rather than threading metadata through every log call.
Pass structured fields as the first arg and the message as the second —
never interpolate values into the message string, that defeats the
redaction list and makes records ungreppable.

When `VT_SENTRY_DSN` is set, server logs at `info` and above are
forwarded to Sentry automatically (via a pino destination stream, not
`Sentry.pinoIntegration()`); redaction still applies and dev does not
forward.

See [docs/logging.md](docs/logging.md) for the redaction
defaults, `VT_LOG_LEVEL` resolution, where the logger singleton lives, and
the Sentry forwarding wiring.

## Git

Commit messages use **Conventional Commits**. Releases are automated with
semantic-release: only `feat` (minor) and `fix` (patch) trigger a release.
Anything user-visible must be one of those — never `refactor` or `chore`.

```
type(scope): description
```

### Types

- `feat`: new user-facing feature or capability
- `fix`: bug fix or correcting wrong behavior (includes UI adjustments and
  performance improvements)
- `chore`: internal code not yet exposed to users (e.g., new hook, data model),
  configs, dependencies, file moves/renames, build scripts
- `refactor`: restructuring code without changing behavior (e.g., extracting
  functions, renaming variables, reorganizing modules)
- `style`: formatting only — no logic changes
- `docs`: documentation changes only
- `test`: adding or updating tests
- `ci`: CI/CD pipeline changes

### Titles

`feat` and `fix` titles are user-facing. Describe the outcome for the user,
not the code change. Implementation details go in the body, not the title.

- Bad: `fix: use shared Button component with corrected label`
- Good: `fix: correct submit button label`
- Bad: `feat: wrap save handler in a transaction`
- Good: `fix: prevent rare data loss when saving`

All other types are developer-facing — implementation details are helpful
and make commits easier to find later.

- Good: `refactor: extract form helpers into src/forms/`
- Good: `chore: add csv parser`
- Good: `test: add tests for table components and hooks`

### Other rules

- Title: lowercase, no period, under 72 characters.
- Scope is optional. Allowed scope: `deps` (dependency changes). Do not scope
  by domain.
- Don't push or create PRs unless asked.
- Don't include a Test plan section in pull request descriptions or comments.
- Don't use `git -C <path>` unless necessary. It triggers permission prompts
  that aren't worth the trouble. Run git commands from the working directory
  instead.

### GitHub

- PR titles must follow Conventional Commits format so they can be cleanly
  squash-merged into a single well-formed commit.

## Testing

- **Framework:** Vitest with jsdom environment (web app); Vitest node
  env for packages.
- **Test location:** `__tests__/` directories alongside source files
  (web), or sibling `*.test.ts` files (packages).
- **Test files:** `ComponentName.test.tsx` or `functionName.test.ts`.
- **Imports:** Use explicit vitest imports (`import { describe, it,
  expect, vi } from "vitest"`).
- **Setup:** `apps/web/src/tests/setup.tsx` provides
  `renderWithProviders()`, `renderWithRouter()`, and `MemoryRouter`.
- **Fixtures/fakes:** `apps/web/src/tests/fake/` has factory functions
  for test data. Shared bootstrap and seed data go in a sibling
  `test/fixtures.ts` next to the code under test.
- **Assertions:** Use explicit `expect()` assertions, not snapshots.
- **User interaction:** Use `@testing-library/user-event` over
  `fireEvent`.
- **Queries:** Prefer accessible queries (`getByRole`,
  `getByLabelText`) over `getByTestId`; don't disambiguate by index.

See [docs/testing.md](docs/testing.md) for the unit / integration
layer split, where to mock depending on migration state, snapshot
guidance, and the shared-fixtures rule.
