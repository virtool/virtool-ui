# Authentication

## Sign in flow

### Initial Load


On initial load the client must determine if the user is currently logged in and to do this the client makes a request
to the API, and if the request succeeds the client is presumed to be logged in.
The API determines whether the user is logged in via authentication tokens set as cookies in the clients browser
which are sent along to the API with every request.
if the request fails then the client is presumed to be logged out and the login page displayed.


### Logging in

When the user enters their username and password the information is sent to the API and checked for validity. 
On a successful login, the API will respond with a `200` status code and set the clients `session_id` and `session_token`
cookies to match the new authenticated session. 
The cookies are not directly accessible to the client for security reasons, so it is determined from the response body
whether the login was successful. 
If the users account has been configured to force a password change on the next login,
the client will receive a `reset_token` in the body of the response and not be sent a `session_token`

### Forced password reset

In the case a user is forced to reset their password by an administrator, after attempting to log in they
will have a new `session_id` cookie sent as well as be sent a `reset_code` in the body of the response. 
By sending the `reset_code` alongside the new password to the API the user can then reset their password.
After a successful password reset the current session is deleted and the user is given a new authenticated session.


**Note:** If an API request is made doing anything other than resetting the password, the password reset session is
immediately invalidated.


## Important tokens

The client is blocked from directly accessing the below listed tokens.
The following section may however prove useful if attempting to diagnose a login issue.
Whichever tokens are present on in the clients browser will be sent with each request to the server.

### session_id

The `session_id` can be thought of as identifying the user's current client.
As a `http-only` cookie the `session_id` cannot be accessed from the client.
When the UI client first contacts the server it will always be assigned a `session_id` regardless of login status. 
From that point forward the  client will package the `session_id` with every request to the server.
The `session_id` is used to identify the session of the client, but is not enough on its own to
prove that the client is an authenticated user.

### session_token

The session token is used to prove that a user is associated with a given authenticated session.
The user's client is the only entity to hold the unhashed version of the session token. 
The session token should be treated as equivalent to the users password for the duration of the token's validity.
The correct session_id and session token must be sent as a pair to be recognized as valid.


### reset_token

The reset token is accessible in JS and is returned from the API during the password reset flow.
Combined with the `session_id` assigned to the client at the time of initiating the password reset request,
this token can be used to reset the user's password.

The session is invalidated when any of the following occur:

1. The user successfully resets their password
2. The associated `session_id` is sent in any request that is not requesting a password reset
3. Ten minutes have elapsed since the `reset_code` was issued


## Logout

A users session can be invalidated either locally by the user choosing to logout or on the server when their session expires.
From the frontends perspective this means that a `logout` can either be initiated via the user or detected via receiving a `401`
response from the API.

Regardless of how the user is logged out it is essential that the following occur:

1. The login page is rendered allowing the user to re-authenticate
2. Data stored in application state is wiped
3. Data stored in the browsers local storage is wiped

Wiping user data and rendering the login page is handled by initiating a full page refresh in js.
While this removes all data directly stored in application state, some parts of the application make use
of local storage to persist state through refresh. 
For this reason whenever a logout is detected local storage must be wiped as well.