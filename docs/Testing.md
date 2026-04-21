# Testing

Most UI components in Virtool are tested via integration testing. Components are
tested in the larger context of the view they are a part of. This allows
detection of interoperability problems and simulation of more realistic use
cases.

## Integration

The primary goal for testing is to ensure that the user experience works as
expected. We rely on integration tests because they ensure related groups of
components work together. Since this involves rendering a whole view, there is
increased need to fake large sections of data. To reduce the burden of simulating
large portions of the application, we have created helpers to assist with writing
tests.

## Dependencies

Spinning up a view for testing often requires certain dependencies as parents of
the component.

Most commonly a component will need one or more of:

- QueryClient (react-query)
- MemoryRouter (wouter)

To make providing these less cumbersome, our test setup exports helper functions
that wrap the components in providers prior to rendering. For most cases
`renderWithProviders` will ensure the needed providers are supplied.

## Data Faking

Fully testing a component's functionality requires the creation of fake data.
Faking functions in `src/tests/fake/` return data matching the API's data models.
They provide fake values for all required fields by default, but override values
can be provided when specific values are needed.

Use these functions whenever possible for data returned from the API.
Centralizing data faking reduces redundancy and ensures that model changes are
tested across all views that use the fakers.

## API Mocking

Many components make requests to the API during normal operation. To accommodate
this in tests, we use `nock` to intercept requests made to the backend. Instead
of mocking query functions, we intercept the HTTP request to verify that
components and queries work together as expected.

Standard mocking functions simplify writing tests that need API mocks. These
functions intercept specific API requests and allow specifying the request body,
URL path parameters, search parameters, and response body.

For details on writing API mocks, see the
[nock documentation](https://github.com/nock/nock?tab=readme-ov-file#usage).
