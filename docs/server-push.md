# Server push

Server → client push runs over **two transports at once** during the
Python → Node migration. Both deliver the same `WsMessage` wire format
into the same client-side `reactQueryHandler`, which invalidates React
Query caches keyed by the message's `interface` field.

## Current state

```
┌────────────────────────┐                ┌──────────────────────────┐
│ Python (legacy)        │                │ Node (this repo)         │
│  data layer @emits     │                │  server/events/emit.ts   │
│       │                │                │       │                  │
│       ▼                │                │       ▼                  │
│  pg_notify             │                │  client.notify           │
└──────────┬─────────────┘                └──────────┬───────────────┘
           │                                         │
           │   Postgres channel: client_events       │
           └──────────────────┬──────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
   Python WSServer                  Node SSE route
   ws/server.py                     routes/events.ts
       │                                 │
       │ WebSocket /ws                   │ EventSource /events
       ▼                                 ▼
   WsConnection.ts                  SseConnection.ts
            \                       /
             \                     /
              ▼                   ▼
                reactQueryHandler
                queryClient.invalidateQueries(...)
```

- **Shared channel.** Both producers publish to the Postgres
  `client_events` channel with the payload shape declared in
  `server/events/channel.ts` (`{ domain, resource_id, operation }`), so
  a single listener can fan out from either source.
- **Domain ownership lives in `broadcast.ts`.** The `resolvers` map in
  `server/events/broadcast.ts` decides which domains the Node SSE route
  hydrates and forwards. Domains without a resolver return `null` and
  the legacy WS path delivers them. As a domain migrates to Node, add a
  resolver here and stop emitting it from Python.
- **Both transports run in parallel.** `routes/_authenticated.tsx`
  initialises and connects both `WsConnection` and `SseConnection`. The
  duplication is intentional during the migration; retire WS once every
  domain has a Node resolver.

## Pure / wired split

The server-push code follows the same layering as other server
features:

- `server/events/channel.ts` — channel name + payload type. Pure.
- `server/events/emit.ts` — publishes a `ClientEvent` via `NOTIFY`.
- `server/events/listen.ts` — `LISTEN`-backed async iterable.
- `server/events/broadcast.ts` — resource resolvers and the
  `ClientEvent → WsMessage` mapping. Pure; safe to unit-test.
- `routes/events.ts` — TanStack Start `createFileRoute` that owns the
  `ReadableStream`, keepalive timer, and SSE framing. Calls
  `requireAuthenticatedRequest` directly because raw `Request`
  handlers run outside the server-function async-local context.

## Auth and session expiry

- SSE handshake runs through `requireAuthenticatedRequest`, so an
  unauthenticated `EventSource` request gets a 401 before the stream
  opens.
- There is no in-stream session-revocation signal on the SSE side
  today. The WS path uses close code `4000` → `resetClient` for
  server-initiated logout; SSE has no equivalent.

## Fragile spots

- **Invalidation granularity.** `reactQueryHandler` maps each
  message's `interface` to `keyFactories[interface].all()` and calls
  `invalidateQueries`. It's generic and resilient to schema drift, but
  coarse — every list and detail under that interface refetches even
  when only one row changed. Fine today; revisit if a hot domain
  starts thrashing.
- **`taskUpdaters` surgical cache patching.** `app/websocket/updaters.ts`
  bypasses `invalidateQueries` for `clone_reference`,
  `remote_reference`, `update_remote_reference`, and `install_hmms`,
  using `setQueriesData` to splice the new `Task` into list and detail
  caches. This avoids a refetch storm during long-running operations
  but couples the updater to the exact shape of those caches (`items[]
  .task`, `status.task`). Any change to those query shapes will
  silently break progress UI. If the cache strategy moves to Router
  loaders or Drizzle-inferred types, these need re-implementation
  rather than a mechanical port.

## TODO

- [ ] **Drop double delivery as domains migrate.** Once a domain has a
      resolver in `broadcast.ts`, remove its `pg_notify` from the
      Python side. `invalidateQueries` is idempotent, but double
      delivery wastes a refetch per event.
- [ ] **Session-revocation signal on SSE.** SSE has no equivalent of
      the WS `code === 4000 → resetClient` flow. A revoked session
      currently stays connected until the next server-function call
      fails auth. Options: a periodic session check in
      `routes/events.ts` that closes the stream, or a dedicated
      `event: session-revoked` frame the client handles like the WS
      `4000` close.
- [ ] **Per-user filtering.** `routes/events.ts` broadcasts every
      `client_events` payload to every authenticated SSE client. The
      `ClientEvent` payload has no user/scope field, so we can't
      filter even if we wanted to. Decide whether to carry the
      broadcast-all model forward or add a scope field before more
      domains migrate.
- [ ] **One reconnect mechanism on SSE.** `SseConnection.ts` layers a
      manual `setTimeout` reconnect on top of the browser's built-in
      `EventSource` auto-reconnect. Pick one — either let the browser
      handle it (drop `onerror` reconnect) or switch to `fetch`
      streaming with full manual control.
- [ ] **Retire `WsConnection` and `reactQueryHandler` lives.** Once
      every domain has a resolver in `broadcast.ts`, delete
      `app/websocket/WsConnection.ts`, drop the WS init in
      `_authenticated.tsx`, and move `reactQueryHandler` and
      `schema.ts` next to `SseConnection.ts` (or fold into
      `app/sse/`).
- [ ] **Remove stray log.** `app/websocket/reactQueryHandler.ts:51`
      logs every message with `window.console.log`. Drop it or gate
      it on a debug flag.
