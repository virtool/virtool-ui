# API Requests

The client fetches data from the backend using `SuperAgent` as the HTTP client library,
and `react-query` for data management and caching.

## Query keys

A query key is an array of strings that uniquely identifies an API request.

```typescript
/** An example query key for requesting the fifth page of samples*/
["samples", "list", "5"];
```

Anytime a query is made with this key the result will be saved in the cache.
Subsequent requests made with this key will get the cached result before making a request
to the server to refresh the data.

A query key must be:

1. Distinct: Every API call with unique parameters must have a unique key (`page`, `per_page`, `term`, `id`, etc.)

```typescript
/* Querys made with additional paramters */
useListSamples(5, 25)[
    /* should always include all paramters in the query key*/
    ("samples", "list", "5", "25")
];
```

2. Deterministic: The same parameters must always produce the same query key

```typescript
/* Querys made with the paramters */
useListSamples(5, 25)[
    /* Should always produce the query key*/
    ("samples", "list", "5", "25")
][
    /* and never */
    ("samples", "list", "25", "5")
];
```

3. Hierarchical: Invalidating general query keys should invalidate more specific query keys below them.

```typescript
    /* Invalidation key */
    ["samples", "list"]

    /* Can invalidate */
    ["samples", "list"]

    /* Can invalidate */
    ["samples", "list", "5", "25"]

    /* Can invalidate */
    ["samples", "list", ...filters]

    /* Can't invalidate */
    ["samples", "details"]

    /* Can't invalidate */
    ["samples", "details", "1a2b3c4d"]
```

To this end virtool-ui uses factory functions to produce query keys.

A typical factory function will resemble the following:

```javascript
/**
 * Factory for generating react-query keys for samples related queries.
 */
export const samplesQueryKeys = {
    all: () => ["samples"] as const,
    lists: () => ["samples", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["samples", "list", ...filters] as const,
    details: () => ["samples", "details"] as const,
    detail: (sampleId: string) => ["samples", "details", sampleId] as const,
};
```

Managing keys in this way reduces the chances of accidental conflicts by storing all keys relevant to a resource in a single place.
Additionally, the hierarchical structure of the keys enables straightforward cache management via partial query matching.
For the above example, requesting the invalidation of all query keys that match `samplesQueryKeys.all()`, results in
all cached sample data being marked as stale and refetched.

## Models

Data returned from the server conforms to models defined in `virtool-core`.
Those models have been rewritten in typescript for usage in virtool-ui but require manual updates
for any changes made to the API.
Typescript models function only as a prediction of what will be returned from the server, and all
type checks are done at compile time.
As a result there is no runtime guarantee that the types will be as predicted, models may need to be adjusted
as discrepancies are found between the TS models and actual returned data.

## Mutations - handling query results

React query exposes options that allow for defining callbacks to be called when a query when an API response is received.
For a mutation you can define these options either at the time of mutation definition or when performing the mutation.
Callbacks defined when performing a mutation will only execute if the component the mutation was request in is still loaded.
Whereas a callback configured when the mutation is originally defined will execute even if the component doing the
mutation is unloaded.

If you want the callback to **always** be called define it with the mutation. ex., invalidation of a now outdated cache

If you want it to occur only when the **component is still loaded** then define it when doing the mutation. ex.,
navigating to a new page once the mutation is complete

## Handling query loading

One of slowest part of rendering a fully stateful page is the need to fetch data from the API.
While a single request is typically fast, if request are made sequentially it can have a notable impact on load speed.
By avoiding sequential loads we can reduce load times to the load time of the slowest mandatory data for a view.
To this end we have a few common patterns that are used to keep perceived load times as short as possible

### Central loading

Central loading involves making the API requests needed for the application in a single spot and
passing the data to components lower in the tree via props or context.
This approach is convenient in that all components down the tree can assume the data is loaded.
Passing data as props does introduce explicit dependencies, so this approach may not be ideal for components
where heavy re-use is expected.

### Pre-caching data

Pre-caching data is when a component requests data from the API that it doesn't directly need to reduce
the load times of child components.
Data loaded by other components remains in the `react-query` cache and can be immediately accessed by any components
using the same query key.
In practice pre-caching can look similar to central loading where many API request are made from
a parent component.
The key difference is that the data is never directly passed down to any child components.
Instead, when the child component make a request for data using the same query it will get data pulled
from the cache immediately without having to wait for the request to resolve.
The major downside to this approach is that the downstream components still need to be written assuming that
the data is not cached.
Often this will mean writing normally unused code to prevent the dependency on the data
being cached by parent components.

### Non-blocking queries

Non-blocking queries refers to any case where data is being fetched but
rendering down the dom tree is allowed to proceed.
This technique can see niche use in cases where not all data is needed on the initial render.
Dialogs can be a good use case for this since the main page can be rendered while the modal
data finishes loading.

## Updates

The UI can become aware of data becoming stale either through direct user action or via websocket messages
sent from the server.
Regardless of the source, generally the best way of handling this is to invalidate the cache of relevant resources.
This will force the UI to refetch the resource from the server, ensuring that the UI is once again fully up to date.
Generally speaking, the cost of making these API requests is minimal, but in some cases it can be appropriate to
update a resource in place.
This should only be done in cases where the updates are incredibly frequent.
