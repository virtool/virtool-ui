# Queries and caching

Data fetching in the SPA goes through
[TanStack Query](https://tanstack.com/query) (React Query, v5) regardless of
the underlying transport. Two transports coexist while the backend migrates:

- **Legacy path** — superagent calls the Python API through the shared
  `apiClient` in `apps/web/src/app/api.ts`. Error shape is
  `error.response?.body.message`.
- **New path** — TanStack Start server functions under
  `apps/web/src/server/<feature>/`, called from the SPA via React Query
  hooks.

Either way, the cache surface is the same: each feature owns a `queries.ts`
module that exports a `*QueryKeys` factory, `queryOptions`-based helpers,
and `use*` hooks. There is no separate per-feature `api.ts` — the request
logic lives directly inside the hook's `queryFn`/`mutationFn` (or a
`queryOptions` factory). Inline the `apiClient` call; reach for a
module-private helper only when the same request is shared by more than one
hook or selected between branches.

## Query keys come from a per-feature factory

A query key is a tuple of primitives that uniquely identifies a cached
request. Every feature that caches data exports a single `*QueryKeys`
factory:

```ts
export const samplesQueryKeys = {
  all: () => ["samples"] as const,
  lists: () => ["samples", "list"] as const,
  list: (filters: Array<string | number | boolean | string[] | number[]>) =>
    ["samples", "list", ...filters] as const,
  details: () => ["samples", "details"] as const,
  detail: (sampleId: string) => ["samples", "details", sampleId] as const,
};
```

Keys must be:

- **Distinct** — every request with different parameters gets a different
  key. `list([5, 25])` and `list([6, 25])` are different keys.
- **Deterministic** — the same parameters always produce the same key. Pick
  an argument order in the factory and stick to it across call sites.
- **Hierarchical** — invalidating a shorter key invalidates every longer
  key beneath it. `invalidateQueries({ queryKey: samplesQueryKeys.lists() })`
  marks every paginated list stale; `samplesQueryKeys.all()` marks every
  sample query stale, lists and details alike.

One factory per feature keeps the hierarchy visible in a single place and
prevents accidental collisions between modules.

## Share query config with `queryOptions()`

Declare a query's key and fetcher once with the `queryOptions()` helper, then
reuse the same options from hooks and route loaders:

```ts
export function sampleQueryOptions(sampleId: string) {
  return queryOptions<Sample, ErrorResponse>({
    queryKey: samplesQueryKeys.detail(sampleId),
    queryFn: () =>
      apiClient.get(`/samples/${sampleId}`).then((res) => res.body),
  });
}

export function useFetchSample(sampleId: string) {
  return useQuery(sampleQueryOptions(sampleId));
}
```

Annotate the `queryOptions` generic (`<Sample, ErrorResponse>`) when the
fetcher is inlined — `apiClient` responses are untyped, so without it the
cached data type degrades to `any`.

The same options object can be passed to `queryClient.ensureQueryData` from
a route loader without duplicating the key or fetcher.

## Prefer route loaders for prefetch

Page-level data should be prefetched in the route's `loader`, not by a
parent component that exists only to fetch on behalf of children. The
router runs the loader during navigation, so the cache is warm by the time
the component mounts — `useQuery` inside the page hits the cache
immediately:

```ts
export const Route = createFileRoute("/_authenticated/samples/$sampleId")({
  loader: async ({ context: { queryClient }, params: { sampleId } }) => {
    await queryClient.ensureQueryData(sampleQueryOptions(sampleId));
  },
  component: SampleDetail,
});
```

`ensureQueryData` is a no-op when the data is already cached, so the same
hook works whether the user arrived from a list page (warm) or via a direct
URL (cold). When a page needs multiple resources, run the `ensureQueryData`
calls in parallel with `Promise.all`.

For data that isn't needed on initial render (e.g. a dialog that opens
lazily), skip the loader and call `useQuery` where the data is consumed.

## Loading and error states: two tiers

A query has three outcomes — pending, error, success — and a consumer has to
account for all three. Pick the tier by how central the data is to the view,
and never collapse pending and error into one branch. The guard
`if (isPending || !data) return <LoadingPlaceholder />` is the anti-pattern: on
error `data` is `undefined`, so a failed request falls into the loading branch
and spins forever instead of showing the error.

### Tier 1 — primary data, via Suspense and the route error boundary

For the resource a route exists to show (detail pages, the record the URL is
"about"), let the framework handle pending and error declaratively:

1. Prefetch in the route `loader` with `ensureQueryData` (above).
2. Read it in the component with `useSuspenseQuery` — expose a
   `useSuspense*` hook next to the `useFetch*` one:

   ```ts
   export function useSuspenseSample(sampleId: string) {
     return useSuspenseQuery(sampleQueryOptions(sampleId));
   }
   ```

3. In the component, destructure `data` and use it directly — **no guard**.
   `useSuspenseQuery` guarantees `data` is defined, and a failure throws.

   ```tsx
   function SampleDetailLayout() {
     const { sampleId } = Route.useParams();
     const { data } = useSuspenseSample(sampleId);
     return <ViewHeader title={data.name} />;
   }
   ```

Loading is absorbed by the `<Suspense>` boundary already wrapping the
authenticated `<Outlet>`. Errors are caught by the router's
`defaultErrorComponent` (`@base/RouteError`), wired once in `router.tsx`: it
reads the HTTP status off the error and renders a permission message for 403,
a not-found for 404, and a retryable message otherwise. A route only needs its
own `errorComponent` when it wants bespoke copy.

Keep a loader's `404 → notFound()` mapping where it exists — that routes a
missing record to the dedicated `notFoundComponent` rather than the error
boundary.

### Tier 2 — secondary data, handled inline with `useQuery`

For data that should fail without taking over the page — paginated lists using
`keepPreviousData`, polling, sidebar widgets, anything optional — stay on
`useQuery` and handle the states explicitly. Render the inline error with
`@base/QueryError` (a red `Alert` taking a `noun`), and gate it on
`isError && !data` — error **only when there's nothing to show** — then handle
`isPending`:

```tsx
const { data, isPending, isError } = useListSamples(page, perPage);

if (isError && !data) {
  return <QueryError noun="samples" />;
}
if (isPending) {
  return <LoadingPlaceholder />;
}
```

The `&& !data` is load-bearing, not defensive. In React Query v5 `error` and
`data` coexist: once a query has loaded successfully, `data` survives a later
failed refetch (the retries-exhausted `refetchError` state). A bare
`if (isError)` would blank an already-rendered list the moment a background
refetch fails — the opposite of Tier 2's job. `isError && !data` shows the
inline error only on an initial-load failure (the real "spins forever" case
this replaces) and keeps stale data on screen through background errors. The
guard still narrows `data` to defined for the success branch, because the only
error state left past it carries `data`.

`if (isPending || !data) return <LoadingPlaceholder />` remains the
anti-pattern: it puts `!data` in the **loading** branch, so an initial-load
failure (where `data` is `undefined`) spins forever instead of erroring.

For a view backed by several `useQuery` calls, the same rule generalises —
error only when something needed is still missing:

```tsx
if ((isErrorA || isErrorB) && (!dataA || !dataB)) {
  return <QueryError noun="files" />;
}
if (isPendingA || isPendingB) {
  return <LoadingPlaceholder />;
}
```

The distinction is deliberate: Tier 1 escalates a failure to a full-route
error state; Tier 2 contains it so the rest of the page keeps working. Make a
view *eager* (error even with stale data on screen) only when staleness
actively misleads — permissions, balances, live job status.

## Pagination keeps the previous page on screen

`placeholderData: keepPreviousData` keeps the previous page visible while
the next one fetches, instead of flashing a spinner. Apply it to any
paginated list:

```ts
return useQuery<SampleSearchResult, ErrorResponse>({
  queryKey: samplesQueryKeys.list([page, per_page, term, labels, workflows]),
  queryFn: () =>
    apiClient
      .get("/samples")
      .query({ page, per_page, find: term, label: labels, workflows })
      .then((res) => {
        const { documents, ...rest } = res.body;
        return { ...rest, items: documents };
      }),
  placeholderData: keepPreviousData,
});
```

This is the v5 replacement for the old `keepPreviousData: true` flag —
don't reintroduce the boolean form.

## Mutation callbacks: definition-time vs call-time

`useMutation` accepts callbacks (`onSuccess`, `onError`, `onSettled`) in
two places, and the difference is load-bearing:

- At **definition time** — passed to `useMutation({ onSuccess, ... })`.
  These fire regardless of whether the calling component is still mounted.
- At **call time** — passed to `mutate(vars, { onSuccess, ... })`. These
  only fire if the component that called `mutate` is still mounted when the
  response arrives.

Use the split deliberately:

- Cache invalidation belongs at definition time — the cache must update
  whether or not the user navigated away.
- Navigation, toasts, and other UI side effects belong at call time — they
  don't make sense after the component is gone.

```ts
export function useUpdateSample(sampleId: string) {
  const queryClient = useQueryClient();
  return useMutation<Sample, ErrorResponse, { update: SampleUpdate }>({
    mutationFn: ({ update }) => updateSample(sampleId, update),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: samplesQueryKeys.detail(sampleId),
      });
    },
  });
}
```

## Update strategy: invalidate, don't patch

When data goes stale — from a user action, a server-push event, or a
successful mutation — invalidate the relevant keys and let React Query
refetch. The hierarchical key structure means one
`invalidateQueries({ queryKey: samplesQueryKeys.lists() })` covers every
paginated list at once.

Reserve in-place cache writes (`queryClient.setQueryData`) for very
high-frequency updates where refetch cost dominates. Hand-written cache
patches couple the writer to the response shape and bypass server-side
filtering and ordering, so they're easy to get subtly wrong.
