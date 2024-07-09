# Authentication

## Sign in

### Initial Load


The client determines if it is logged in on the first API request. If the request succeeds, the client is logged in.
If the request fails, then the client is logged out and the login page is displayed.


### Logging in

When the user submits their username and password, they are validated by the API. 
If the credentials are valid, the API will respond with a `200` status code and 
sets cookies that identify the client as having an authenticated session.


## Sessions

A client can be either authenticated or unauthenticated. 
The client's authentication status is tracked by associating the client with a session on the API.
This association is created by cookies written to the client by API.
Cookies that are present in the clients browser will be included with every request to the API.
Understanding the relationship between the cookies and sessions is useful to diagnose a login issue.

### session_id

The `session_id` can be thought of as identifying the client.
When the client first contacts the server it will always be assigned a `session_id` regardless of login status. 
From that point forward the client will package the `session_id` with every request to the server.
The `session_id` is used to identify the session of the client, but does not
prove that the client is authenticated.

### session_token
A session token is only set for authenticated sessions.

A valid session token proves that client is associated with an authenticated session.
If a `session_id` is associated with an authenticated session, the `session_token` must be included
in every request using that `session_id`.

Only the client holds the unhashed version of the session token. 
The session token should be treated as equivalent to the users password for the duration of the token's validity.

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


## Forced password reset

Administrators can force users to reset their passwords. 

If a user is forced to reset their password then on their next login the API will respond with a `200` status code, cookies that identify the client as 
having a password reset session, and a `reset_code` in the response body.

The client can reset the password by sending the `reset_code` and the new password.
If the password reset is successful, the API will respond with a `200` status code and 
sets cookies that identify the client as having an authenticated session.

After a client has received a `reset_code`, any API request other than a password reset invalidates the session.

### reset_token

The reset token is accessible in JS and is returned from the API during the password reset flow.
Combined with the `session_id` assigned to the client at the time of initiating the password reset request,
this token can be used to reset the user's password.

The session is invalidated when any of the following occur:

1. The user successfully resets their password
2. The associated `session_id` is sent in any request that is not requesting a password reset
3. Ten minutes have elapsed since the `reset_code` was issued