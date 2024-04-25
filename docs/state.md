

# State

State management in React is an essential and sometimes challenging aspect of creating interactable components. 
Here we will three forms of state commonly used in virtool henceforth refered to as server, location, and component state.
Each state accomplishes the same general goal of keeping data available through rerenders, but the details of each shape
the kinds of data that can/should be stored in them.

With each type of state occupying a different niche it is very rarely the case that any data should be duplicated across the different states.
Furthermore, state duplication creates the possibility for desynchronization between the two states, creating difficult to debug problems.



 ### Server state

Server state encapsulates all data that is fetched directly form the server or fully derivable from the data sent.
React component interact with server state through the interface of custom API querying hooks that abstract away the process of fetching data from the server.
Server state must always be a direct reflection of the data returned from the server, the data being updated exclusively via API request


 ### History state

Location state is data that is stored in the browsers history object. 
Data stored here is unique compared to standard React state in that it is persistent through refresh and navigation.
Data stored in the URL should also be treated as shareable state, since the user can theoretically copy the URL and send it 
to another user.

State stored in the path of the URL typically includes `ids` of the resources being viewed and or filtering options for lists of data.

 ### Component State
 
Component state is state that is stored locally to the component via `useState` or similar. 
Compared to the other types of state component state is quite volatile as it vanishes when the component unloads.
For this reason component state is well suited for storing data that doesn't need to be retained between refresh/navigation.



# API Requests

As a CSR SPA it is necessary for the UI of Virtool to fetch data from the backend in order to render meaningful data.
The job of making the API request is currently handled via `SuperAgent` with data management and caching being handled via react-query.


## Query keys

Query keys are a collection of strings that uniquely identifies the results of an API request within react-querys cache. 
Query keys must be:

 1. Uniquely identify every query. including differentiation of search parameters (page, ect)
 2. Deterministic/reproducible. ie: The same query must always produce the same query key
 3. Filterable. It should be possible to update or invalidate all queries without knowing the exact query parameters used to make the query

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
As a result there is no true guarantee that type will be as predicted, models may need to be adjusted as discrepencies are found between the 
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
In most cases the correct way to handle this is forcing the UI to fetch a new version of the data via cache invalidation.




