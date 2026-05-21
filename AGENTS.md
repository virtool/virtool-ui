# Virtool UI

React + TypeScript single-page application for Virtool, a bioinformatics platform.

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

## Package manager

This repo uses **pnpm**. Common commands:

```bash
pnpm install                      # install everything (root + apps + packages)
pnpm --filter @virtool/web dev    # run the web dev server
pnpm -r test                      # run every package's tests
pnpm -r typecheck                 # typecheck every package
pnpm check                        # biome check (whole repo)
```

## Tooling

### Commands (from repo root)

| Task | Command |
| --- | --- |
| Dev server | `pnpm develop` (Vite, port 5173) |
| Typecheck | `pnpm typecheck` |
| Lint + format | `pnpm check` |
| Format only | `pnpm format` |
| Test (single run, all packages) | `pnpm test` |
| Test (filtered) | `pnpm --filter @virtool/web exec vitest run src/path/to/file` |
| Build | `pnpm build` |

### When to run checks

- After changing route files in `apps/web/src/routes/`: run
  `pnpm --filter @virtool/web exec tsr generate` (or the equivalent
  `@tanstack/router-cli generate`) to regenerate
  `apps/web/src/routeTree.gen.ts` before running type checks.
- Before committing: `pnpm check` and `pnpm typecheck`.
- After changing tests: run the specific test file with
  `pnpm --filter @virtool/web exec vitest run <path>`.
- Full test suite only when asked or when changes are cross-cutting.
- Always fix all lint errors and warnings. The main branch is guaranteed to
  pass `pnpm check` cleanly, so any issues are caused by your changes — never
  dismiss them as pre-existing.
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
- `src/server/` - Express SSR server
- `src/tests/` - Test setup, fakes, and API mocks
- `src/types/` - Shared type definitions

### Path aliases

Every feature directory has a `@name` alias (e.g., `@app/utils`, `@base/Button`,
`@samples/api`). The catch-all `@/*` maps to `apps/web/src/*`. Prefer specific
aliases over `@/`.

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

Use the superagent-based client in `apps/web/src/app/api.ts`. Feature API
functions live in each module's `api.ts`. API errors have the shape
`error.response?.body.message`.

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

## Code style

- **Functions:** Use function declarations, not arrow functions (`func-style`
  enforced).
- **Imports:** Biome organizes imports automatically.
- **Conditionals:** Always use curly braces with `if`/`else`.
- **Prefer `const`** over `let`.

### TypeScript: prefer `type` over `interface`

Use `type` for all type definitions. Reserve `interface` only when declaration
merging is explicitly needed (e.g. extending third-party module types).

Bad:

```ts
interface User {
  id: string
  name: string
}
```

Good:

```ts
type User = {
  id: string
  name: string
}
```

### TypeScript: prefer literal unions over enums

Use string literal unions instead of `enum`. Literals are plain values at
runtime, require no import at call sites, and serialize naturally.

Bad:

```ts
enum Status {
  Pending = 'pending',
  Running = 'running',
  Complete = 'complete',
}
```

Good:

```ts
type Status = 'pending' | 'running' | 'complete'
```

### TypeScript: document every exported type with a one-line JSDoc

Every exported `type` (or `interface`, when declaration merging requires it)
gets a `/** ... */` JSDoc comment, even when the name seems self-explanatory.
The payoff is that hovering the symbol in any consumer shows what it
represents without jumping to the definition.

```ts
/** Discriminated auth state: authenticated, awaiting forced reset, or anonymous. */
export type AuthContext = …

/** Read/write/clear access to the session cookie. Abstracts framework details. */
export type CookieAdapter = { … }
```

### Naming: name functions after what they return or do

- `is` prefix → type predicate or boolean, no side effects (`isAdmin`,
  `isEmpty`, `isExpired`)
- `has` prefix → boolean ownership check, no side effects (`hasRole`,
  `hasPermission`)
- `get` prefix → returns a value, no side effects (`getLifetime`,
  `getExpiry`)
- `check` / `validate` / `assert` → may throw, may have side effects,
  returns void or an error (`checkAuth`, `assertDefined`)

The line between `is` and `has` is loose in practice — don't overthink it.
The important line is between all of those and `check`/`validate`/`assert`:
if it can throw or has side effects, it is not an `is` or `has`.

Prepositional names like `lifetimeFor` or `dataFor` are not in the rule —
prefer `getLifetime` / `getData`.

### Naming: do not suffix functions with their layer or mechanism

Exported function names should describe the domain action or returned value,
not the file, framework, or implementation layer that contains them. Avoid
suffixes like `Fn`, `Core`, `Handler`, or `Impl` in exported names. Let the
module path carry the layer.

### Comments: default to no comment; document the *why*, not the *what*

Well-named code does not need a narrator. A comment is worth writing when
removing it would make the next reader stop and wonder *why* — a hidden
constraint, a coupling to something off-screen, a deliberate choice that
looks wrong at first glance.

**Exported types and interfaces** are the exception: each one gets a
one-line JSDoc, even if the name is good.

**Functions** usually do not need a comment — the name and signature carry
the meaning. Add one when the *why* is non-obvious: a security invariant, a
quirk being preserved for compatibility, an edge case the body handles
silently.

```ts
// Honour the invalidate_sessions flag the Python side sets but never reads.
if (user.invalidateSessions) { … }
```

**Constants** get a comment when the value choice or its coupling is
non-obvious. `COOKIE_NAME = 'session'` does not. `COST = 12` does, because
changing it invalidates pinned bcrypt fixtures elsewhere.

What not to write:

- Restating the code (`// increment i by 1`)
- The current task (`// added for the auth flow`, `// fix for issue #123`)
- The caller (`// used by LoginForm`) — those rot the moment something moves
- Multi-paragraph essays — if a comment grows past two or three lines,
  consider whether it belongs in a doc, a commit message, or a better
  function name instead

### Concurrency: run independent awaits in parallel

Awaits with no data dependency belong in `Promise.all`. Serial chains pay
the sum of all latencies instead of the slowest.

```ts
const [index, fasta, otus] = await Promise.all([
  client.indexes.get({ id }),
  client.indexes.fasta({ id }),
  client.indexes.otus({ id }),
]);
```

Skip when: a later call needs an earlier result, or an early failure should
short-circuit expensive later work (e.g. bcrypt verify before hash).

Use `Promise.allSettled` when you need every result regardless of failures.

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
- Scope is optional but preferred.
- Don't push or create PRs unless asked.
- Don't include a Test plan section in PR descriptions.
- Don't use `git -C <path>` unless necessary. It triggers permission prompts
  that aren't worth the trouble. Run git commands from the working directory
  instead.

## Testing

- **Framework:** Vitest with jsdom environment (web app); Vitest node env
  for packages.
- **Test location:** `__tests__/` directories alongside source files (web),
  or sibling `*.test.ts` files (packages).
- **Test files:** `ComponentName.test.tsx` or `functionName.test.ts`.
- **Imports:** Use explicit vitest imports (`import { describe, it, expect,
  vi } from "vitest"`).
- **Setup:** `apps/web/src/tests/setup.tsx` provides `renderWithProviders()`,
  `renderWithRouter()`, and `MemoryRouter`.
- **Fixtures/fakes:** `apps/web/src/tests/fake/` has factory functions for
  test data.
- **Assertions:** Use explicit `expect()` assertions, not snapshots.
- **User interaction:** Use `@testing-library/user-event` over `fireEvent`.
- **Queries:** Prefer accessible queries (`getByRole`, `getByLabelText`) over
  `getByTestId`.

### Shared test fixtures live in their own module

When two or more `*.test.ts` files share the same bootstrap, seed data, or
test-double factories, extract them into a sibling `test/fixtures.ts` module
rather than copy-pasting. The cost of duplication is silent drift.

Reach for extraction at the second or third copy, not later. Things worth
sharing:

- Seed helpers (`seedAlice(db, hash)`)
- Test-double factories (`makeCookies()`)
- Pinned fixture constants (e.g. a known plaintext + bcrypt hash pair)

The shared module goes next to the tests it serves — not in a top-level
`test/` directory — so it travels with the code under test.

Before creating a fixture, check whether one already exists. Look for a
sibling `test/` directory next to the code under test, and grep for the
fixture name or a likely export across the package. Adding a parallel copy
is the same mistake as the duplication this rule exists to prevent.
