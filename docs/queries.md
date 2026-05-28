# Queries and caching

Data fetching in the SPA goes through
[TanStack Query](https://tanstack.com/query) (React Query, v5) regardless of
the underlying transport. Two transports coexist while the backend migrates:

- **Legacy path** — each feature's `api.ts` uses superagent to call the
  Python API. Error shape is `error.response?.body.message`.
- **New path** — TanStack Start server functions under
  `apps/web/src/server/<feature>/`, called from the SPA via React Query
  hooks.

Either way, the cache surface is the same: each feature owns a `queries.ts`
module that exports a `*QueryKeys` factory, `queryOptions`-based helpers,
and `use*` hooks.

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
    queryFn: () => getSample(sampleId),
  });
}

export function useFetchSample(sampleId: string) {
  return useQuery(sampleQueryOptions(sampleId));
}
```

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
Suspense queries (`useSuspenseQuery`) are not currently used.

## Pagination keeps the previous page on screen

`placeholderData: keepPreviousData` keeps the previous page visible while
the next one fetches, instead of flashing a spinner. Apply it to any
paginated list:

```ts
return useQuery<SampleSearchResult, ErrorResponse>({
  queryKey: samplesQueryKeys.list([page, per_page, term, labels, workflows]),
  queryFn: () => listSamples(page, per_page, term, labels, workflows),
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
