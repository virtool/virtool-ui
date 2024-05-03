# State

When initialized in a React component, the lifetime of standard variables is only a single render.
As a result, any data that needs to exist for more than one render must be stored is some form of persistent storage.
There are several ways to ensure that data persists, but the best one depends on the data being stored

Any single piece of data should generally only be stored in one type of persistent storage. 
Storing data in more than once in persistent storage allows for desynchronization between the stored
versions resulting in difficult to catch bugs. 


## Application State
 
Application state is data that is stored within the client via Redux, `useState`, ect. 
Any data stored within the application is wiped on refresh, making it well suited for storing
data that can or should be forgotten on refresh. 
Component level state is currently the only suitable way to store high security data like
passwords or API keys.

## Browser storage

Browser state encompasses any data stored in the browser using built-in APIs. 
Data stored here is generally persistent through both rerender and page refresh.
As a result, the client needs elegantly handle any valid values stored via the browser
after a refresh.

### Browser history

Anytime the user navigates or data is written to the URL, the change will be stored in the browser's history object.
Data stored in the browsers history is insecure since it persists, at least until the browser
window is closed.
Data stored specifically in the URL has the additional feature of being shareable with other users.
Storing data relevant to filtering, sorting or parameters can be helpful for users wanting to
share a given page.

### Local Storage

Data stored in local storage persists until it is explicitly cleared.
While the data should be wiped between users for usability reasons, the storage method is insecure.
Local storage is useful for data that needs to persist through navigation.

## Server data

Server data is all data that is sent from the API or directly derived from it.
React components ingest server data through the interface of custom API querying hooks.
The local copy of the data is lost on refresh, but will be replaced when the page next loads.
The data returned from the hooks should not be directly mutated inside of components, in most cases
non-persistent local copies should be made in the component if the shape of the data needs to be changed.


