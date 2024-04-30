# API Requests

As a CSR SPA it is necessary for the UI of Virtool to fetch data from the backend in order to render meaningful data.
The job of making the API request is currently handled via `SuperAgent` with data management and caching being 
handled via `react-query`.


## Query keys

Query keys are a collection of strings that uniquely identifies the results of an API request within react-querys cache. 
Query keys must be:

 1. Uniquely identified: including differentiation based on query search parameters 
(page, per_page, term, ect)
 2. Deterministic: i.e., The same query must always produce the same query key
 3. Filterable: It should be possible to update or invalidate all queries without knowing the exact query parameters used to make the query

To this end virtool-ui uses factory functions to produce hierarchical and predictable query keys. 

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
Additionally, the hierarchical structure of the keys enables powerful cache management via partial query matching.
For the above example by requesting the invalidation of all query keys that match `samplesQueryKeys.all()` all cached sample data can 
be wiped with a single command. 


## Models

Data returned from the server conforms to models defined in `virtool-core`.
Those models have been rewritten in typescript for usage in virtool-ui but require manual updates for any changes made to the API.
Typescript models function only as a prediction of what will be returned from the server, and all type checks are done at compile time.
As a result there is no true guarantee that type will be as predicted, models may need to be adjusted as discrepancies are found between the 
TS models and actual returned data. 


## Mutations - handling query results
React query exposes options that allow for defining callbacks to be called when a query succeeds or fails.
For mutation you can define these options either at the time of mutation definition or when performing the mutation. 
Callbacks defined on mutation will only execute if the component the mutation was request in is still loaded.
Whereas callbacks defined at the mutation is originally defined will execute even if the component is unloaded.

If you want the callback to **always** be called define it with the mutation. 

If you want it to occur only when the **component is still loaded** then define it when doing the mutation.


## Handling query async nature

Since they require making a call to the API the nature of querys in inherently asynchronous.
As a result any component that relies on react query must be able to elegantly handle the case that request is not yet complete.


## Error handling with queries

Meh deal with later


## Updates

In some cases the UI can become aware that some chunk of state it out of date before it becomes stale.
In most cases the correct way to handle this is forcing the UI to fetch a new version of the data via 
cache invalidation.



