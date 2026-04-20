# TanStack Router Migration

Replace wouter with TanStack Router as an intermediate step toward TanStack Start.
Start is built on Router, so doing Router now means the eventual Start migration is
about adding SSR and server functions — not re-learning routing.

## Decisions

### Route tree authoring

- File-based routing with `@tanstack/router-plugin/vite` and `autoCodeSplitting: true`.
- Route files live in `src/routes/` mirroring the URL structure.
- Current `React.lazy()` calls in `Main.tsx` become redundant and are removed.

### Typed search params

- Per-route zod schemas via `@tanstack/zod-adapter` with `fallback()` + `.default()`.
- Custom `parseSearch`/`stringifySearch` using `query-string` to preserve the existing
  URL shape: repeated-key arrays (`?labels=1&labels=2`) and presence-absence dialog
  params (`?openX=true` present vs. absent).
- Keep the presence-absence convention for dialog params — schema uses
  `z.boolean().optional()` and the serializer strips `false` values.

### Search-param compatibility shim

- Reimplement `useDialogParam`, `usePageParam`, `useUrlSearchParam`,
  `useNaiveUrlSearchParam`, and `useListSearchParam` internally on TanStack's
  `useSearch`/`useNavigate`. External signatures unchanged — callers don't change
  during cutover.

### Test infrastructure

- Rewrite `renderWithRouter(ui, path?)` using a synthetic single-route wrapper:
  `createMemoryHistory` + `createRouter` with a catch-all route whose component is
  `ui`. Signature and return shape (`{ ...rtlResult, history: string[] }`) preserved.
- Reproduce the `history` array by subscribing to `router.history` events.
- `renderWithProviders` (React Query wrapping) unchanged.

### Transition strategy

- Big-bang single cutover. One PR (or stacked series) replaces the entire router.
  Wouter uninstalled at the end.
- Intermediate shippable states land on `main` (prep work, compat shim, test helper
  rewrite) before the cutover PR.

### Auth and route gating

- New `_authenticated` pathless layout route with `beforeLoad` redirect via router
  context.
- Current outside-router auth gate in `App.tsx` (loading / first-user / login / main)
  stays outside the router — the router only mounts when authenticated.
- Administration role-based redirect (`hasSufficientAdminRole` in `Settings.tsx`)
  becomes a `beforeLoad` with `ensureQueryData` on the account query.

### Data loading

- No route loaders during this migration. React Query stays as the data layer.
- Put `queryClient` on the router context now via
  `createRootRouteWithContext<{ queryClient: QueryClient }>()` to unblock future loader
  adoption.

### React Compiler

- Keep `babel-plugin-react-compiler` unchanged.
- Avoid `useMatchRoute` due to open reactivity bug under React Compiler (TanStack
  Router #4499). Use `useLocation`/`useMatches` instead.
- If the bug is encountered elsewhere, selectively exclude affected files from the
  compiler.

### Bundle size

- Accept the ~10 KB gzip increase over wouter. No hard merge gate.
- `autoCodeSplitting` offsets the increase for non-root routes.
- Guard devtools import with `import.meta.env.DEV`.

## Hard Constraints

- **Test shim stability.** `renderWithRouter(ui, path?)` is called in 234 sites across
  44 test files. Its signature, return shape (`{ ...rtlResult, history: string[] }`),
  and initial-path semantics cannot change. 4 tests assert on `history[0]`.
- **URL preservation.** All current routes must resolve to the same components at the
  same URLs.
- **Param preservation.** 20+ named search params with the same names and coercion
  (arrays, booleans, numerics, dialog-state keys).
- **React 19 + React Compiler.** TanStack Router supports React 19. One open
  Compiler-related bug (#4499) affects `useMatchRoute` — avoided per decisions above.
- **Vite plugin ordering.** `@tanstack/router-plugin/vite` MUST be registered before
  `@vitejs/plugin-react`.
- **Single active router.** No dual-router coexistence — wouter and TanStack Router
  cannot run side-by-side in the same React tree.
- **React Query provider in tests.** Every test wraps in a fresh `QueryClient` via
  `renderWithProviders`. That wrapping must remain.

## Wouter to TanStack Router API Mapping

| wouter | TanStack Router | Notes |
| --- | --- | --- |
| `<Router hook={useBrowserLocation}>` | `<RouterProvider router={router}>` | Router created with `createRouter({ routeTree })` |
| `<Route path="/x/:id" component={C} />` | `createFileRoute('/x/$id')({ component: C })` | `$` replaces `:` for params |
| `<Switch>` | Implicit route matching + `<Outlet />` | No explicit switch needed |
| `<Link href="/x">` | `<Link to="/x">` | Typed `params` and `search` props available |
| `<Redirect to="/samples" />` | Index route `beforeLoad: () => { throw redirect({ to: '/samples' }) }` | 7 redirects to convert |
| `useLocation()` | Split by use case | See below |
| `useLocation()[0]` (read path) | `useLocation({ select: l => l.pathname })` | Or `useMatch` for route-specific |
| `useLocation()[1]` (navigate) | `useNavigate()` returning `navigate({ to })` | |
| `useParams()` | `Route.useParams()` or `useParams({ from: '/x/$id' })` | Typed per-route |
| `useSearch()` (raw string) | `Route.useSearch()` (typed object) | Via zod schema |
| `navigate("~/refs")` (tilde relative) | `navigate({ to: '/refs' })` | Absolute path — 1 production use |

### `useLocation` decomposition

wouter's `useLocation()` returns `[path, navigate]`. TanStack Router has no single
equivalent — decompose per use case:

| Current usage | Replacement |
| --- | --- |
| Read current path for display | `useLocation({ select: l => l.pathname })` |
| Navigate to a new path | `const navigate = useNavigate(); navigate({ to: '/x' })` |
| Check if path matches a pattern | `useMatchRoute()` (but see React Compiler note) or `useMatch` |
| Read search params | `Route.useSearch()` |

## Search-Param Schema Examples

Representative zod schemas for the common param patterns in this codebase.

### Pagination

```ts
import { fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  page: fallback(z.number(), 1).default(1),
});
```

### Text search

```ts
const searchSchema = z.object({
  find: fallback(z.string(), "").default(""),
});
```

### Boolean filter

```ts
const searchSchema = z.object({
  filterOtus: fallback(z.boolean(), true).default(true),
  sortDesc: fallback(z.boolean(), true).default(true),
});
```

### Array param (repeated keys)

```ts
const searchSchema = z.object({
  labels: fallback(z.array(z.number()), []).default([]),
  workflows: fallback(z.array(z.string()), []).default([]),
});
```

### Dialog state (presence-absence)

```ts
const searchSchema = z.object({
  openCreateOTU: fallback(z.boolean(), undefined).optional(),
  openEditSample: fallback(z.boolean(), undefined).optional(),
});
```

### Enum sort

```ts
const searchSchema = z.object({
  sort: fallback(z.enum(["coverage", "depth", "weight"]), "coverage").default("coverage"),
});
```

## Interface Contracts

### Compat-shim hooks

Each hook is reimplemented in `src/app/hooks.tsx` to internally use TanStack Router
while preserving the existing call-site API.

#### `useUrlSearchParam<T>(key, defaultValue?)`

```ts
function useUrlSearchParam<T>(key: string, defaultValue?: T): [T, (value: T) => void] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const value = search[key] ?? defaultValue;
  const setValue = (next: T) =>
    navigate({ search: (prev) => ({ ...prev, [key]: next }) });
  return [value, setValue];
}
```

#### `useDialogParam(key)`

```ts
function useDialogParam(key: string): [boolean, () => void, () => void] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const open = search[key] === true;
  const setOpen = () =>
    navigate({ search: (prev) => ({ ...prev, [key]: true }) });
  const setClosed = () =>
    navigate({
      search: (prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      },
    });
  return [open, setOpen, setClosed];
}
```

#### `usePageParam()`

```ts
function usePageParam(): [number, (page: number) => void] {
  return useUrlSearchParam("page", 1);
}
```

#### `useListSearchParam<T>(key, defaults?)`

```ts
function useListSearchParam<T>(key: string, defaults?: T[]): [T[], (values: T[]) => void] {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const values = search[key] ?? defaults ?? [];
  const setValues = (next: T[]) =>
    navigate({ search: (prev) => ({ ...prev, [key]: next }) });
  return [values, setValues];
}
```

### Root-route context

```ts
import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
```

### Vite plugin order

```ts
// vite.config.ts
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react({ babel: { plugins: [["babel-plugin-react-compiler"]] } }),
    // ...other plugins
  ],
});
```

### Synthetic-route test shim

```ts
import { createMemoryHistory, createRouter, createRootRoute, createRoute } from "@tanstack/react-router";

function renderWithRouter(ui: ReactNode, path = "/") {
  const history: string[] = [];

  const rootRoute = createRootRoute();
  const catchAllRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "$",
    component: () => ui,
  });
  rootRoute.addChildren([catchAllRoute]);

  const memoryHistory = createMemoryHistory({ initialEntries: [path] });
  const router = createRouter({
    routeTree: rootRoute,
    history: memoryHistory,
    defaultPendingMinMs: 0,
  });

  router.history.subscribe(() => {
    history.push(router.state.location.href);
  });

  const result = renderWithProviders(<RouterProvider router={router} />);
  return { ...result, history };
}
```

### `useMatchPartialPath` mapping

Current `useMatchPartialPath` in `src/app/hooks.tsx` checks if the current path starts
with a given prefix. Replace with:

```ts
function useMatchPartialPath(path: string): boolean {
  const location = useLocation({ select: (l) => l.pathname });
  return location.startsWith(path);
}
```

Avoid `useMatchRoute` due to React Compiler issue #4499.

### Final cleanup checklist

Items to remove after the cutover PR is stable on `main`:

- [ ] `wouter` dependency from `package.json`
- [ ] `history` dependency (if no longer used)
- [ ] Old search-param hooks (once all callers use `Route.useSearch()` directly)
- [ ] `base/Link.ts` wouter re-export
- [ ] `MemoryRouter` component from `src/tests/setup.tsx`
- [ ] `useBrowserLocation` import in `App.tsx`
- [ ] `useMatchPartialPath` (once replaced at all call sites)

## Per-Feature Migration Checklist

| Feature | Route file | Routes | Search params | Notes |
| --- | --- | --- | --- | --- |
| samples | `Samples.tsx` | 6 + `SampleDetail.tsx`(6) | page, find, term, labels, workflows, open* | Deepest nesting; analyses passthrough |
| references | `References.tsx` | 4 + `ReferenceDetail.tsx`(7) + `OtuDetail.tsx`(4) | createReferenceType, cloneReferenceId, edit*Id, open* | Three-level nesting |
| administration | `Settings.tsx` | 5 + role-based redirect | status | Role redirect becomes `beforeLoad` |
| account | `Account.tsx` | 3 + redirect | — | Simple |
| analyses | `Analyses.tsx` | 2 | sort, sortDesc, filter*, reads, activeHit, activeIsolate | Direct `URLSearchParams` usage in `hooks.ts` needs rewrite |
| hmm | `Hmm.tsx` | 2 | find, page | Simple |
| jobs | `Jobs.tsx` | 2 | state, page | Array param (`state`) |
| ml | `ML.tsx` | 1 | — | Simplest module |
| subtraction | `Subtraction.tsx` | 3 | find, page | Simple |

## Pre-Cutover Prep

- [ ] Install `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/zod-adapter`, `query-string`
- [ ] Add `TanStackRouterVite` to `vite.config.ts` before `react()` plugin
- [ ] Create root route with `queryClient` context
- [ ] Create `_authenticated` pathless layout route with `beforeLoad` redirect
- [ ] Build search-param compat-shim hooks in `src/app/hooks.tsx`
- [ ] Rewrite `renderWithRouter` in `src/tests/setup.tsx`
- [ ] Scaffold `src/routes/` file tree mirroring current URL structure
- [ ] Verify `npm run typecheck` and `npx vitest run` pass after each prep step

## Post-Cutover Follow-Up

- Remove `wouter` and `history` dependencies
- Remove old search-param hook implementations (after callers migrate to direct
  `Route.useSearch()`)
- Remove `base/Link.ts` wouter re-export
- Remove `MemoryRouter` from `src/tests/setup.tsx`
- Investigate and remove suspected dead code: `<Route path="~/samples/:sampleId/files">`
  in `SampleFileSizeWarning.tsx:33`
- Investigate broken redirect `/refs/settings/*` -> `/settings` in
  `references/References.tsx:23-24`
- Evaluate route-level loaders for 404 handling (deferred from this migration)
- Migrate compat-shim callers to direct `Route.useSearch()`/`useNavigate()` for full
  type safety
