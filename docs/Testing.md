# Testing

 For most UI components in virtool they are tested via integreation testing. 
 In short, this means that components are tested in the larger context of the view they are a part of.
 Doing it this way allows for detection of interoperability problems and simulation of more real use cases

## Depencies? 
 React router
 redux
 query client

## Interactivity


 The way we test components in virtool is interactivity based




## Data faking


To fully test the functionality of most components requires the creation of fake data.
To simply this process faking functions are created for the test environment.
These functions are designed to return data matching the data models used in the api.
While they provide fake values for all required fields by default, override values can also
be provided if specific values are needed.
Make use of these functions whenever possible to generate data returned from the API.
By centralizing the data faking in this way it reduces redundancy in the tests and ensures that 
changes to the models are tested in all view tests that use the fakers.


## API mocking


During the course of normal operation many views will need to make requests to the API.
To accommodate this in a testing environment we use `nock` to intercept request made to the backend.
Instead of mocking out the query functions, we intercept the http request since it test if
components and queries are working together as expected.

In order to simplify writing tests that need API mocks, we use a set of standard mocking functions for 
intercepting API requests. These functions intercept specific API requests while allow the user specify the request 
body, URL path parameters, search parameters, and response body for API calls that support them. 






For details about on how to write API mocks see the [nock](https://github.com/nock/nock?tab=readme-ov-file#usage) 
documentation.






## Redux

## Integration testing


 