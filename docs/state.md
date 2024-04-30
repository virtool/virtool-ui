

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

Secure data should never be stored in the URL, as it may be retained as browser history in the client's browser

State stored in the path of the URL typically includes `ids` of the resources being viewed and or filtering options for lists of data.

 ### Component State
 
Component state is state that is stored locally to the component via `useState` or similar. 
Compared to the other types of state component state is quite volatile as it vanishes when the component unloads.
For this reason component state is well suited for storing data that doesn't need to be retained between refresh/navigation.






