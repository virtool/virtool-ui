# Auth handoff: login moves to TanStack Start

We are moving login (and, in subsequent PRs, the rest of the
authentication surface) out of the Python backend at `../virtool` and into
this app. The Python backend keeps serving the API; both processes share
the same Postgres database, so the cookies this app issues must be
bit-compatible with what Python's session middleware reads.

This document captures the cookie/DB contract so it does not drift.

## Cookies

Two cookies are set on successful authentication:

- `session_id` — value `"session_" + 96 hex chars` (96 = 48 random bytes
  hex-encoded). This is what Python's session middleware looks up in the
  `sessions` table.
- `session_token` — independent random hex string. Only its SHA-256
  (lowercase hex) is stored, in `sessions.token_hash`. The plaintext is
  only ever in the cookie.

Both cookies use the same attributes, matching
`virtool/api/utils.py:_set_secure_cookie`:

| Attribute   | Value |
|-------------|-------|
| `HttpOnly`  | true |
| `Secure`    | true in production (`NODE_ENV === "production"`), false locally |
| `SameSite`  | `Lax` |
| `Path`      | `/` |
| `Max-Age`   | `2_600_000` seconds (~30 days) — same regardless of session lifetime |

On a forced-reset login (`users.force_reset = true`), **only** `session_id`
is set; the row stores a `reset_code` and no `token_hash`. The client
receives `{ reset: true, reset_code: "..." }` and is expected to call the
`/reset` flow with the code.

On logout, both cookies are deleted and the row is removed. Python's
behaviour also mints a fresh anonymous-session `session_id`; we skip that
because Python's middleware will create one on the next request that needs
one.

## `sessions` row shape

Defined in `apps/web/src/server/db/schema/sessions.ts`. **This is a
read-only mirror** of the table whose DDL is owned by Python's Alembic
migrations (`virtool/sessions/models.py`). Do not generate or push Drizzle
migrations from this app. When Python's schema changes, update the mirror
here by hand.

| Column           | Type / nullability | Notes |
|------------------|--------------------|-------|
| `id`             | `serial`, not null | autoincrement int PK, not the cookie value |
| `session_id`     | `text`, unique, not null | cookie value (`"session_" + 96 hex`) |
| `user_id`        | `int`, nullable, FK `users.id` (cascade) | null on anonymous sessions (we don't write these) |
| `ip`             | `text`, not null | best-effort from `cf-connecting-ip` / `x-forwarded-for`; fallback `""` |
| `created_at`     | `timestamp`, not null | |
| `expires_at`     | `timestamp`, not null | 30d remember / 60min no-remember / 10min reset |
| `token_hash`     | `text`, nullable | `sha256(session_token).hex()` on authenticated rows, null on reset |
| `reset_code`     | `text`, nullable | populated only on `session_type='reset'` |
| `reset_remember` | `bool`, nullable | mirrors the `remember` flag through the reset round-trip |
| `session_type`   | enum `session_type_enum` (`anonymous`, `authenticated`, `reset`), not null | |

## Password storage

Owned by Python via `passlib`/`bcrypt` at cost 12 (`$2b$12$...`). The
column is `bytea`. From this app we decode the bytea to UTF-8 and call
`bcrypt.compare(plain, hash)` — same wire format, same library family,
verified by the pinned-Python-hash fixture in `password.test.ts`.

## Login response shape

Server function: `apps/web/src/server/auth/functions.ts` → `loginFn`.

Returns one of:

- `{ reset: false }` with HTTP 201 — both cookies set.
- `{ reset: true, reset_code: "..." }` with HTTP 200 — only `session_id`
  cookie set.

Throws `Error("Invalid handle or password.")` (HTTP 400) on credential
failure.

This matches the response shape of Python's `POST /account/login` so the
existing `LoginForm.tsx` consumer needs no behavioural changes — only the
client-side adapter in `account/api.ts` had to switch from superagent to
the server function caller.

## Deployment note

TanStack Start runs in SPA mode (`spa.enabled: true` in `vite.config.js`).
Server functions still work in SPA mode but require the deployment to
route the `/_serverFn/*` path to a Node process. Tilt + minikube is
already configured for this; the `apps/web/scripts/serve.mjs` static
`sirv` server is for the SPA shell and is *not* sufficient on its own once
this PR ships. Confirm the production deploy points the auth-bearing
paths at the Node server.

## What is in this first PR

- `users` and `sessions` Drizzle mirrors.
- `bcrypt` dependency + `pnpm` build allowance in `pnpm-workspace.yaml`.
- `apps/web/src/server/auth/{password,tokens,cookies,session,core,functions}.ts`.
- `loginFn` and `logoutFn` server functions.
- Thin client wrappers in `account/api.ts` calling the new server
  functions; `wall/queries.ts` `useLoginMutation` returns the new shape;
  `LoginForm.tsx` reads `data.reset_code` directly and the error message
  from `error.message`.
- Unit tests for `password` and `tokens`.

## Out of this PR

- DB-backed tests for `session.ts` and `core.ts` — pending a Postgres-in-
  test harness (vitest globalSetup against a transient schema). Track as a
  follow-up.
- `force_reset` submission flow (`/reset` endpoint). Login already emits
  the reset-required response and writes the row, so the existing
  `LoginForm.tsx` continues to navigate to the reset screen.
- First-user / setup flow.
- API keys, basic auth, change-password.
- Migrating account read endpoints (`GET /api/account`,
  `/api/account/settings`, `/api/account/keys`) off Python.
- A schema-drift check that diffs our Drizzle mirror against Python's
  `models.py`.
