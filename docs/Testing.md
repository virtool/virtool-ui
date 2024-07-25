# Testing

For most UI components in virtool they are tested via integration testing.
In short, this means that components are tested in the larger context of the view they are a part of.
Doing it this way allows for detection of interoperability problems and simulation of more real use cases

## Integration

The biggest goal for testing in the UI is to ensure that the user experience works as expected.
To that end the biggest thing we have to ensure is that the UI behaves as expected when all the pieces are
assembled.
For that reason we primarily rely on integration tests for testing components as that ensures related groups of components work
together.
Since this involves rendering a whole view, there is increased need to fake large sections of data.
To reduce the burden simulating large portions of the application we have created helpers to assist writing tests.

## Dependencies

As part spinning up a view for testing it is often required to ensure that
certain dependencies are present as parents of the component.

Most commonly a component will need one or more of:

-   Provider (react-redux)
-   QueryClient (react-query)
-   ThemeProvider (styled-components)
-   MemoryRouter (react-router)

To make providing these less cumbersome our test setup exports helper functions
which will wrap the components in the providers prior to rendering.
For most cases `renderWithProviders` will ensure most needed providers are supplied.

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

During the course of normal operation many components will need to make requests to the API.
To accommodate this in a testing environment we use `nock` to intercept request made to the backend.
Instead of mocking out the query functions, we intercept the http request chekcing that
the components and queries are working together as expected as part of the test.

In order to simplify writing tests that need API mocks, we use a set of standard mocking functions for
intercepting API requests. These functions intercept specific API requests while allow the user specify the request
body, URL path parameters, search parameters, and response body for API calls that support them.

For details about on how to write API mocks see the [nock](https://github.com/nock/nock?tab=readme-ov-file#usage) documentation.
