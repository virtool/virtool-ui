## Changes
<!--- Provide the broad strokes of the changes made in a bulleted list --->

## Compatiblity

Any changes that require a newer version of the API are considered breaking
changes.

Common breaking changes:
 - Making a request to a new API endpoint that will return `403` or `404` in older versions of the API.
 - No longer sending request fields required by previous versions of the API 
 - Requiring new fields from an API endpoint that will not be present in
   responses from older versions of the API
 - Breaking backwards compatibility with old response data shapes


Choose one:
 - [ ] The changes do not break compatibility
 - [ ] The changes break compatibility and the API version has been updated if required


## Pre-Review Checklist
 - [ ] All changes are tested
 - [ ] All touched code documentation is updated
 - [ ] All tests pass in your local environment
 - [ ] Deepsource issues have been reviewed and addressed
 - [ ] Debugging logging and commented out code has been removed

 
## Screenshots:
_Only required for visual changes_.

