# Authentication

Authentication owns its own subtree under
`apps/web/src/server/auth/` and a global function middleware wired
into `apps/web/src/start.ts`. This doc covers the whole picture: the
code layout (a documented exception to the three-file
`data.ts`/`service.ts`/`functions.ts` layering used by other server
features), how requests are gated, the session model, and the
login / reset / logout flows.

## Code layout

The pure layer is split by primitive rather than collapsed into one
`data.ts`:

- `core.ts` — login / logout / password-reset domain logic
- `session.ts` — session row CRUD
- `tokens.ts` — session id and token generation, hashing
- `password.ts` — bcrypt wrappers
- `passwordPolicy.ts` — the minimum-length rule and its message. Pure,
  and deliberately free of bcrypt, the db, and the TanStack shell, so
  the browser can import it (see "Minimum password length" below)
- `cookies.ts` — `CookieAdapter` type (framework-agnostic cookie I/O)
- `verify.ts` — request verification (pure, given a cookie adapter and
  db handle)

The wired layer is split too:

- `service.ts` — `checkConfiguredPasswordLength`, which reads the
  setting and applies the pure rule to it
- `functions.ts` — TanStack Start server functions for login, logout,
  password reset
- `middleware.ts` — TanStack Start middleware that delegates to
  `verify.ts`

The shape is the same as labels — pure below, framework wiring above —
just finer-grained because the primitives are distinct (crypto vs.
persistence vs. cookies vs. verification). A future feature that needs
this level of separation should follow this pattern; one that doesn't
should look like labels.

## Authentication middleware

Authentication is enforced globally at the server-function boundary,
not per-handler. The exempt endpoints live in
`server/auth/exceptions.ts`:

```ts
export const authenticationExceptions: ReadonlyArray<{ url: string }> = [
  createFirstUserFn,
  getPasswordPolicyFn,
  loginFn,
  logoutFn,
  resetPasswordFn,
];
```

and are wired up in `apps/web/src/start.ts`:

```ts
const authenticationMiddleware = createAuthenticationMiddleware(
  authenticationExceptions,
);

export const startInstance = createStart(() => ({
  defaultSsr: false,
  requestMiddleware: [csrfMiddleware, cspNonce],
  functionMiddleware: [authenticationMiddleware],
}));
```

Every server function is gated by default. Public endpoints opt out by
being listed in the `exceptions` array — passed as **server-function
references**, not URL strings. The middleware derives the path from
each fn's bound `url`, so the exception list can't drift out of sync
with a rename.

The list is a standalone module rather than an inline array so it can
be asserted on: `middleware.test.ts` pins its exact contents, and a fn
added to it by mistake fails that test instead of silently becoming
publicly callable. Its type is annotated rather than inferred — an
inferred type would name TanStack's server-fn types transitively and
break declaration emit for `@server/*` importers.

The middleware lives in `server/auth/middleware.ts` and exposes these
helpers:

- **`createAuthenticationMiddleware(exceptions)`** — builds the global
  function middleware. Resolves the session for every non-exception
  call and attaches it to `context.session`.
- **`requireSession()`** — the server-only resolver that the middleware
  delegates to. Throws `UnauthorizedError` and sets a 401 response
  status on failure. A handler that needs the session calls this rather
  than reading `context.session`, so it authenticates on its own terms
  even if the global middleware's exception list ever regresses. Nothing
  currently reads `context.session`.
- **`requireAuthenticatedRequest(request)`** — for raw `Request`
  handlers in `createFileRoute` (e.g. SSE / streaming routes like
  `routes/events.ts`). These run outside the server-function
  async-local context, so the middleware can't reach them. Returns a
  401 `Response` on failure for the caller to `return` directly.
- **`requireAdminRole(session, role)`** — throws `ForbiddenError` and
  sets a 403 when the session user does not hold at least `role`. Roles
  are ranked `full` (strongest) through `base` (weakest), so `"base"`
  means "any administrator".

Verification itself is pure: `verify.ts` exports `verifyRequest(db,
request)` and `verifyAuthenticatedSession(db, sessionId, sessionToken)`
with no framework imports. The middleware is the only place that ties
verification to the TanStack Start request context — keeping
verification reusable from any handler shape that can produce a
`Request` or a cookie pair.

### Why a global middleware and not per-fn guards

Per-fn `requireSession()` calls would be easy to forget on a new
server function, and forgetting is silent — the fn would just be
publicly callable. Default-on with an explicit opt-out flips the
failure mode: forgetting to list a fn in `exceptions` produces a 401
the moment you test it, not a security hole.

### Authentication is global, authorization is per-handler

The middleware answers *who is calling*, never *what they may do*. Every
authorization check is written explicitly at the top of the handler in
`functions.ts`, before any call into `data.ts`:

```ts
export const deleteGroup = createServerFn({ method: "POST" })
	.validator(groupIdSchema)
	.handler(async ({ data }) => {
		await requireAdminRole(await requireSession(), "base");
		...
	});
```

`data.ts` stays a pure persistence layer and assumes its caller has
already been authorized — never put a role check there.

Not every endpoint needs a rule. Reads that are open to all
authenticated users by design — the group list, the job list — carry no
guard, and that is a decision, not an oversight. Ordinary users need the
group list to set sample rights and pick a primary group, and jobs are
visible to everyone on the instance. Say so in a comment where it is not
obvious, so the next reader can tell a deliberate omission from a
forgotten one.

This is the layer that has bitten us. Endpoints migrated from Python
arrived without the role checks their Python counterparts had, and
because authentication *is* automatic, an unauthorized endpoint looks
exactly like an authorized one until someone reads the handler. When you
add a server function, decide its authorization explicitly, and write
the test that pins a 403 — a hole here is silent. A
`requirePermission(...)` middleware and a CI-checked table of
deliberately open endpoints are planned to make the omission loud.

## Session model

Sessions are rows in the Postgres `sessions` table
(`apps/web/src/server/db/schema/sessions.ts`). Each row carries a
`sessionType` discriminator: `"authenticated"` or `"reset"`. The client
identifies itself with two cookies set by `server/auth/cookies.ts`:

- **`session_id`** — opaque identifier of a session row. Set on
  successful login and on a successful reset. Present alone (no
  `session_token`) during a forced-reset flow.
- **`session_token`** — proves the `session_id` belongs to an
  authenticated session. Only set on the authenticated branch of
  login and after a successful reset. The server stores the bcrypt-ish
  hash via `hashToken` in `server/auth/tokens.ts`; only the client
  ever holds the unhashed value. Treat it as equivalent to the user's
  password for the token's validity.

There is **no anonymous `session_id`**. The new server functions only
set the cookie when a real session row exists (`core.ts:90`,
`core.ts:99`, `core.ts:198`). This is a deliberate departure from the
legacy Python behaviour described in older docs — don't reintroduce
anonymous sessions without an explicit reason.

A reset session is not "authenticated" as far as the middleware is
concerned — any non-exception server function call from a client
holding only a reset cookie returns 401.

## Session invalidation

`verifyAuthenticatedSession` (`server/auth/verify.ts`) rejects a session
when the row is missing, the type is not `authenticated`, the token hash
does not match, the row has expired, or **`users.active` is false**. That
last one is why deactivation takes effect immediately: `active` is
re-read on every request rather than trusted at login.

**`users.invalidate_sessions` is written but never read.** It is set to
`true` on an admin's change to a user's `active`, `password`, or
`force_reset` (`server/users/data.ts:421-433`) and on a self-service
reset (`core.ts:260`), mirroring Python, whose service invalidates the
user's sessions on their next request. Nothing on the TypeScript side
consumes it. The consequence is concrete: an admin changing a user's
password or forcing a reset **does not revoke that user's existing
sessions here** — the deactivation case is covered only because it also
flips `active`. The self-service reset path is fine for a different
reason: `core.ts:250` deletes the rows outright via
`invalidateUserSessions`.

Do not "fix" this by rejecting sessions whose user has
`invalidate_sessions` set. The reset flow sets the flag `true` and *then*
creates the new authenticated session (`core.ts:254-265`), and nothing
clears it, so that gate would reject the fresh session on its first
request and lock the user out permanently. The fix is to delete the
session rows at the point of invalidation — that is VIR-2671's job.

## Session lifetimes

Defined in `server/auth/session.ts:15-17`:

| Kind                          | Lifetime   |
| ----------------------------- | ---------- |
| Authenticated, `remember`     | 30 days    |
| Authenticated, no `remember`  | 60 minutes |
| Reset                         | 10 minutes |

These mirror the Python values in `virtool/sessions/data.py` so a row
written by either backend is indistinguishable. Don't drift them — the
comment in `session.ts` exists because the migration depends on both
sides minting interchangeable rows.

## Login

`loginFn` (`server/auth/functions.ts:40`) is the public server
function. It delegates to `core.login`, which:

1. Looks up the user by handle (case-insensitive). A missing or
   inactive user still pays the `verifyPassword` cost against
   `TIMING_DUMMY_HASH` so the missing-handle and wrong-password paths
   are indistinguishable to a timing observer (`core.ts:20`,
   `core.ts:75`).
2. Verifies the password with bcrypt.
3. Branches on the user's `forceReset` flag:
   - `forceReset = false` → mints an authenticated session, sets both
     cookies, returns `{ status: "authenticated" }`.
   - `forceReset = true` → mints a reset session, sets only
     `session_id`, returns `{ status: "reset_required", resetCode }`.

The `resetCode` is returned in the response body (not a cookie) so the
client can hold it in JS for the duration of the reset flow.

## First-user setup

A fresh instance has no users; the root document reports
`first_user: true` and the `_authenticated` guard redirects to
`/setup`. `createFirstUserFn` (`server/auth/functions.ts`) is the
public server function that bootstraps the instance. It is unauthenticated
by necessity — it runs before any user or session exists — and delegates
to `core.createFirstUser`, which:

1. Rejects with `FirstUserExistsError` (→ 409) if any user already
   exists, so the endpoint can't be used to mint further accounts once
   setup is done.
2. Creates the user as a full administrator (`administrator_role =
   "full"`, `force_reset = false`).
3. Mints an authenticated session and sets both cookies — the first
   user is logged in without a separate login step.

The client mutation (`useCreateFirstUser` in `wall/queries.ts`) drops
the cached `root` and `account` documents on success so the guard
refetches them fresh instead of reusing the pre-setup snapshot (which
still says `first_user: true` and would bounce the user back to
`/setup`). It then navigates to `/`; the now-authenticated guard admits
the user.

## Forced password reset

`resetPasswordFn` (`server/auth/functions.ts:78`) takes the new
password and the `resetCode` returned from the previous login.
`core.resetPassword`:

1. Resolves the session_id from the cookie and loads the row, requiring
   `sessionType = "reset"`.
2. Compares the supplied `resetCode` against the stored one with
   `timingSafeEqual` (`core.ts:121`). A mismatch invalidates the
   session and throws.
3. Rejects an expired session (`expiresAt` past).
4. Rejects a password that matches the user's current hash
   (`PasswordReuseError`).
5. Invalidates **all** of the user's existing sessions
   (`invalidateUserSessions`), updates the password / clears
   `forceReset` / sets `lastPasswordChange` / sets `invalidateSessions`,
   then mints a new authenticated session and rotates both cookies.

Step (5) must match the Python order in
`virtool.account.data.AccountData.reset` so a user mid-reset sees the
same behaviour regardless of which backend serves them
(`core.ts:175-200`).

On success the client navigates away from the wall. The reset has
already rotated the cookies, so the user is authenticated; leaving them
on the form would strand them there.

A reset session is invalidated by:

- Successful reset (cookies rotate to the new authenticated session).
- A `reset_code` mismatch on `resetPasswordFn`.
- 10-minute expiry.

## Minimum password length

The minimum is the `minimum_password_length` instance setting, read from
Postgres by `getSettings`. It is **not** a constant, and it is **not** a
zod rule.

`checkConfiguredPasswordLength(db, password)` (`server/auth/service.ts`)
is the single enforcement point. Every path that **sets** a password
calls it: `createFirstUserFn`, `resetPasswordFn`, `createUser`, and
`updateUser`. It reads the setting, applies the pure
`checkPasswordLength` from `passwordPolicy.ts`, and throws
`PasswordTooShortError`; each handler maps that to a 400 carrying the
error's message.

It is deliberately **not** applied at login. Login authenticates an
existing credential rather than setting a new one, and a user whose
stored password is shorter than the current minimum must still be able to
log in — the forced-reset flow that replaces it is only reachable through
login. For the same reason the account form's *old password* field
carries no length rule.

### Why not a zod validator

The obvious home is `.validator()`, and it is the wrong one. A validator
runs before its handler with no db handle, so it cannot read the setting.
It also fails badly: a zod rejection surfaces as a **500** whose message
is a JSON dump of the issue list, which is not something a form can put
in front of a user. The handlers throw a 400 with a real message instead,
matching every other domain error here.

### How the browser learns the minimum

`getPasswordPolicyFn` (`server/settings/functions.ts`) returns
`{ minimumPasswordLength }` and nothing else. It is **public** — listed
in `authenticationExceptions` — because the first-user and forced-reset
forms both set a password before any session exists. It returns the
minimum alone rather than the settings row, which holds instance
configuration no unauthenticated caller should read.

Client-side, `usePasswordRules()` (`forms/password.ts`) turns it into the
`react-hook-form` rules every password form spreads into `register`, so
the message quotes the configured value.

Until the policy resolves — and if it fails outright — the hook applies
**no length rule at all**. Do not be tempted to fall back to the default
of 8: the configured minimum can be *lower* than the default, so a guess
would reject passwords the server accepts and strand the user on a form
that will not submit. Omitting the rule defers to the server, which is
the only authority on the setting and rejects a short password with a 400
quoting it. That makes the server's message load-bearing, so every
password form must render its mutation error.

Every route that renders a password form prefetches the policy so this
window is not hit in practice: `/login`, `/setup`, the account profile,
and the two admin user routes. They use `prefetchQuery`, not
`ensureQueryData` — a failed settings read must not take down the wall or
the page.

## Logout

### Server side

`logoutFn` (`server/auth/functions.ts:68`) calls `core.logout`, which
deletes the session row keyed by the `session_id` cookie and clears
both cookies (`core.ts:104`). It's listed in the middleware's
`exceptions` array — calling it while already logged out is harmless.

### Client side

A logout is either user-initiated or forced. The user-initiated path is
`useLogout` in `account/queries.ts:149`, which runs `logoutFn()` and
then calls `resetClient()`.

A forced logout is what happens when the session stops verifying
underneath a running tab — its row deleted, it expired, or its user was
deactivated. (An admin-initiated password change or forced reset only
sets `users.invalidate_sessions`, which nothing here reads yet, so it
does not revoke a session — see **Session invalidation** below.) Every
route into a forced logout converges on `endSession` (`app/session.ts`),
which clears
`sessionStorage` and loads `/login?reason=session-ended&redirect=…`. The
full document load is what drops everything held in memory, and the
`reason` puts a "Your session ended" message on the wall. Three things
can call it:

- **`app/api.ts`** — a SuperAgent plugin that ends the session on any
  401 from the Python API.
- **`router.tsx`** — the query and mutation cache `onError`, matching
  `UnauthorizedError` by name. Server-function errors cross the boundary
  as plain `Error`s with only the name preserved, so there is no status
  to match on.
- **`app/sse/SseConnection.ts`** — on a 401 from the `/events`
  handshake. The `EventSource` error event carries no status, so it
  confirms with a `HEAD /events` before ending anything.

`endSession` is inert until `armSessionEnd` runs, which
`routes/_authenticated.tsx` does once an authenticated load has
succeeded. This is load-bearing, not defensive: the login wall and the
authenticated route guard both fetch the account and *expect* a 401 when
nobody is logged in. Without the arming step a first-time visitor would
be told their session ended, and the wall could reload itself in a loop.

Auth state on initial load is still checked by
`routes/_authenticated.tsx`'s `beforeLoad`, which redirects to `/login`
if `fetchAccount` throws.

### `resetClient`

`resetClient` (`app/utils.ts:119`) does two things:

```ts
window.sessionStorage.clear();
window.location.reload();
```

The full-page reload wipes everything held in memory — React state,
React Query cache, zustand stores, the SSE connection.
Clearing `sessionStorage` drops persisted form state.

**`localStorage` is not cleared.** Anything persisted to `localStorage`
survives logout. If you add a `localStorage` key whose meaning depends
on the logged-in user (cached user data, per-user preferences keyed by
implicit identity), either clear it from `resetClient` or scope the
key by user id so the stale value can't be picked up by the next user
on the same browser.
