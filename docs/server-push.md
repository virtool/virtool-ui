# Server push

Server → client push runs over a single transport: a Server-Sent
Events stream served by this repo at `/events`. Each frame is an
id-only `{ domain, operation, id }` message; the client invalidates
React Query caches keyed by `domain` and refetches the fresh resource
through the normal REST API.

## Shape

```
┌────────────────────────┐                ┌──────────────────────────┐
│ Python                 │                │ Node (this repo)         │
│  data layer @emits     │                │  server/events/emit.ts   │
│       │                │                │       │                  │
│       ▼                │                │       ▼                  │
│  pg_notify             │                │  client.notify           │
└──────────┬─────────────┘                └──────────┬───────────────┘
           │                                         │
           │   Postgres channel: client_events       │
           └──────────────────┬──────────────────────┘
                              │
                              ▼
                   Node SSE route
                   routes/events.ts
                       │
                       │ EventSource /events
                       ▼
                   SseConnection.ts
                       │
                       ▼
                   reactQueryHandler
                   queryClient.invalidateQueries(...)
```

Both Python and Node publish `{ domain, resource_id, operation }`
payloads on the Postgres `client_events` channel (see
`server/events/channel.ts`). The Node SSE route is the only consumer:
it converts each event into the wire shape and forwards it. No
resource resolution happens on the server side.

## Wire format

The SSE handler emits one `data:` frame per event:

```json
{ "domain": "labels", "operation": "insert", "id": 4 }
```

- `domain` — one of the literals in `SseDomainSchema` (`account`,
  `groups`, `indexes`, `jobs`, `labels`, `messages`, `models`,
  `references`, `roles`, `samples`, `uploads`, `users`). Frames with
  any other `domain` fail `safeParse` on the client and are dropped
  with a warning — by design, so contract drift is loud.
- `operation` — `"insert"`, `"update"`, or `"delete"`. `create` events
  map to `insert`; the other two pass through.
- `id` — per-domain primary key type. Mongo-owned domains (`indexes`,
  `references`, `roles`, `samples`) use string ids; the others use
  number ids. A frame whose `id` type doesn't match its `domain` is
  rejected at the parse boundary.

The handler also sends `: connected` on open and `: keepalive` every
25 s to keep proxies and the browser's `EventSource` happy.

## Why id-only

The earlier design fetched and broadcast the full resource on each
event, so every connected browser received the same fat payload over
its persistent connection. Pushing only the id and letting the client
refetch through the REST API has two advantages:

1. **Per-user authorisation runs on the refetch.** The REST endpoint
   already enforces the caller's permissions, so a user who sees the
   "something changed" signal still only gets the data they're
   allowed to see. The previous fanout-to-all model bypassed that —
   if a resource leaked into the broadcast, every connected client
   saw it.
2. **No per-domain server work.** Adding push for a new domain is
   just a `pg_notify` from the producer. The SSE route forwards the
   shape unchanged.

The cost is N client refetches per change instead of one server-side
fetch + N pushes. Acceptable today; revisit if a hot domain shows up
in load metrics.

## Auth and session expiry

- The SSE handshake runs through `requireAuthenticatedRequest`, so an
  unauthenticated `EventSource` request gets a 401 before the stream
  opens. (Raw `Request` handlers in `createFileRoute` run outside the
  server-function async-local context, so they call the helper
  directly instead of relying on middleware.)
- There is no in-stream session-revocation signal. A revoked session
  stays connected until the next server-function call fails auth,
  which then triggers the client-side reset.

## Pure / wired split

- `server/events/channel.ts` — channel name + payload type. Pure.
- `server/events/emit.ts` — publishes a `ClientEvent` via `NOTIFY`.
- `server/events/listen.ts` — `LISTEN`-backed async iterable.
- `server/events/broadcast.ts` — pure `ClientEvent → SseMessage` shape
  conversion.
- `routes/events.ts` — TanStack Start `createFileRoute` that owns the
  `ReadableStream`, keepalive timer, SSE framing, and the
  authentication gate.

## Client side

- `app/sse/SseConnection.ts` opens the `EventSource`, manages
  reconnect, and pipes parsed messages into `reactQueryHandler`.
- `app/sse/schema.ts` defines `SseMessageSchema`, which validates the
  wire frame and strips unknown fields.
- `app/sse/reactQueryHandler.ts` maps `message.domain` to a query-key
  factory and invalidates by operation: `update` invalidates
  `detail(id)`, `insert` and `delete` invalidate `lists()`. Factories
  that lack a method fall back to `all()`. Unknown domains are
  ignored.

## Follow-ups

- **Session-revocation signal.** Add a periodic session check in
  `routes/events.ts` that closes the stream when the session is
  revoked, or emit a dedicated `event: session-revoked` frame the
  client can handle like a forced logout.
- **Per-user filtering.** The handler forwards every `client_events`
  payload to every authenticated client; `ClientEvent` has no
  user/scope field. Decide whether to carry that broadcast-all model
  forward or add a scope field as more domains move onto push.
- **One reconnect mechanism.** `SseConnection.ts` layers a manual
  `setTimeout` reconnect on top of the browser's built-in
  `EventSource` auto-reconnect. Pick one — drop `onerror` reconnect
  or switch to `fetch` streaming with full manual control.
- **Dedicated nested-job fetch (Approach B).** Job-nested sites
  (`sample.job`, `index.job`, `analysis.job`, `subtraction.job`) keep
  their live `progress`/`state` fresh by mounting `useFetchJob(id)`
  seeded with the nested object, so a `jobs` update frame invalidates
  `jobQueryKeys.detail(id)` and refetches. That refetch hits
  `/jobs/:id`, which returns the full `Job` (args, claim, steps) —
  far more than the nested view needs. Add a lightweight server
  function (or `?view=nested` param) that returns just the
  `JobNested` shape, and point `useFetchJob`'s seeded callers at it to
  drop the over-fetch.
- **Push for `tasks` and `hmm`.** Task-nested sites
  (`references/components/ReferenceItem.tsx`,
  `references/components/Detail/Remote.tsx`,
  `hmm/components/HmmInstall.tsx`) render live task `progress`/`step`
  but can't use the Approach-A pattern: `tasks` and `hmm` are not
  `SseDomain` literals and there is no `/tasks/:id` fetch + task query
  module. Add the domains to `SseDomainSchema`, wire producers to
  `pg_notify` on task/hmm changes, and add a task query module before
  applying the same seeded-refetch fix there.
