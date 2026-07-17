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
  `references`, `roles`, `samples`, `tasks`, `uploads`, `users`).
  Frames with
  any other `domain` fail `safeParse` on the client and are dropped
  with a warning — by design, so contract drift is loud.
- `operation` — `"insert"`, `"update"`, or `"delete"`. `create` events
  map to `insert`; the other two pass through.
- `id` — per-domain primary key type. Domains not yet migrated off
  Mongo on the Python side (`indexes`, `references`, `roles`) use
  string ids; the others use number ids. A frame whose
  `id` type doesn't match its `domain` is rejected at the parse
  boundary.

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

The SSE handshake runs through `requireAuthenticatedRequest`, so an
unauthenticated `EventSource` request gets a 401 before the stream
opens. (Raw `Request` handlers in `createFileRoute` run outside the
server-function async-local context, so they call the helper directly
instead of relying on middleware.)

### Revoking a connected session

The handshake is the only time a stream is authenticated, so a session
that stops verifying underneath a connected client would otherwise leave
the stream up until the client happened to reconnect. A watch
(`server/events/revocation.ts`) re-runs the gate every `KEEPALIVE_MS`
and closes the stream once it fails.

The watch is exactly as sharp as the gate it runs, and no sharper. It
catches a session row that is gone (a logout elsewhere, a self-service
reset, an admin-initiated deactivation, password change, or forced reset
— all of which now delete the user's session rows) and a user who has
been deactivated. It closes on the next tick after the gate stops
verifying.

**Closing the stream is the entire revocation signal.** There is no
`session-revoked` frame. The client reconnects, the handshake answers
401, and it ends the session from there — one path to test and to
reason about, at the cost of one extra round trip on a connection that
is going away regardless.

### Why the client has to ask

`EventSource` gives the application a bare `error` event with **no
status code**, and the spec says so outright ("little to no information
can be made available in the events themselves"). All the client gets is
`readyState`, and it only separates two things:

| What happened | `readyState` in `onerror` | Browser retries? |
| --- | --- | --- |
| Any non-200 — 401, but also 502, 503 | `CLOSED` | **no** |
| Transport dropped, or the stream ended | `CONNECTING` | yes |

So a revoked session and a proxy 502 mid-deploy are *indistinguishable*
at the point of failure. `SseConnection.ts` reads `readyState` before
calling `close()` (which would force it to `CLOSED` and destroy the
signal); on `CLOSED` it asks `HEAD /events`, and only a 401 abandons the
connection and ends the session. Anything else backs off and reconnects.
Treating every `CLOSED` as a revoked session would sign every user out
during a deploy.

Note the corollary: a browser **never** reconnects on its own after a
401. Any endless reconnect loop against a revoked session is the
application's own doing.

## Pure / wired split

- `server/events/channel.ts` — channel name + payload type. Pure.
- `server/events/emit.ts` — publishes a `ClientEvent` via `NOTIFY`.
- `server/events/listen.ts` — `LISTEN`-backed async iterable. Its
  per-connection buffer is capped (`MAX_QUEUE`); a consumer that falls
  that far behind has its stream dropped rather than buffered without
  bound, and the client reconnects and refetches to re-sync.
- `server/events/broadcast.ts` — pure `ClientEvent → SseMessage` shape
  conversion.
- `routes/events.ts` — TanStack Start `createFileRoute` that owns the
  `ReadableStream`, keepalive timer, SSE framing, and the
  authentication gate.

## Client side

- `app/sse/SseConnection.ts` opens the `EventSource`, manages
  reconnect, and pipes parsed messages into `reactQueryHandler`. On a
  *reconnect* (not the first connect) it invalidates all queries, since
  frames NOTIFYed while the stream was down — including a server-side
  queue-overflow drop — never arrived; the initial connect skips this
  because the route loaders just populated the cache.
- `app/sse/schema.ts` defines `SseMessageSchema`, which validates the
  wire frame and strips unknown fields.
- `app/sse/reactQueryHandler.ts` maps `message.domain` to a query-key
  factory and invalidates the narrowest key the domain actually caches
  under. `update` prefers `detail(id)`, falling to `lists()` for a
  list-only domain and to `all()` only when neither is cached; `insert`
  and `delete` invalidate `lists()`, or `all()` when the domain caches no
  list. Banners are the one carve-out: their active banner sits at
  `active()`, outside `lists()`, so an `update` there stays on `all()`
  (`updateNeedsAll`). Unknown domains are ignored.
- `jobs/refresh.ts` is the one exception to that mapping. See below.

## Job updates are batched, not invalidated

Jobs are the only domain that emits an update frame per running job per
progress wave, and every job on screen holds its own `detail(id)` query
(see the nested-job sites below). Invalidating each frame's detail
therefore cost one `getJob` request per running job per tick — 25 rows,
25 requests.

So `jobs`/`update` frames do not go through `selectQueryKey`. They go to
a queue built by `createJobRefreshQueue` (`jobs/refresh.ts`), one per
`QueryClient`, which:

1. Buffers job ids for 500 ms, deduplicating them.
2. Invalidates `jobQueryKeys.lists()` once per wave. Progress moves a
   job between states, so a jobs list's counts, ordering, and filters
   drift no matter how many details are refreshed. This is a no-op on
   pages that cache no jobs list.
3. Drops ids whose `detail(id)` has no **active** observer, then reads
   the rest through the `getJobs` server function — one request per
   wave, chunked at the 100-id cap `getJobs` validates. This is what
   keeps the jobs list page, whose rows render from the list query, from
   fetching a detail per row.
4. Writes each result straight into its `detail(id)` cache. `getJobs`
   returns the full `Job`, the same shape `getJob` returns, so
   `detail(id)` stays one canonical shape and `JobDetail` — which
   renders `args` and `steps` — reads the same entry as a sample row
   rendering only `progress`.

A failed batch falls back to invalidating each id's detail, taking the
fan-out it was avoiding rather than leaving every progress bar frozen.

Two properties of that queue are load-bearing, and both are easy to
undo by accident:

- **Active observers, not cached data.** Filtering on
  `getQueryData(...) !== undefined` looks equivalent and is not.
  React Query keeps a detail's data for the whole `gcTime` after its row
  unmounts, and `invalidateQueries` defaults to `refetchType: "active"`
  — so the invalidation this replaced never refetched those. Reading
  them here would mean a batch per wave for minutes after navigating off
  a job-heavy page: a fan-out the old path did not have.
- **Batches never overlap.** `drain()` runs waves one at a time. Two
  reads in flight at once can resolve out of order, and the loser's
  `setQueryData` writes a stale snapshot over a newer one — dragging a
  progress bar backwards, or reviving a job that has already finished.
  Per-frame `invalidateQueries` had no such hazard, because React Query
  resolves races within a query key itself; batching moves that
  responsibility here. Serializing also lets a slow server widen the
  window on its own, since everything arriving during a batch coalesces
  into the next.

## Follow-ups

- **Per-user filtering.** The handler forwards every `client_events`
  payload to every authenticated client; `ClientEvent` has no
  user/scope field. Decide whether to carry that broadcast-all model
  forward or add a scope field as more domains move onto push.
- **Revocation latency.** The watch is a poll, so a revoked session
  keeps its stream for up to `KEEPALIVE_MS`, and the cost is one
  indexed session lookup per connected client per tick. If either
  becomes a problem, publish revocations onto `client_events` and let
  the route close the matching streams on the event instead.
- **Nested-job over-fetch (Approach B).** Job-nested sites
  (`sample.job`, `index.job`, `analysis.job`, `subtraction.job`) keep
  their live `progress`/`state` fresh by mounting `useFetchJob(id)`
  seeded with the nested object, so a `jobs` update frame refreshes
  `jobQueryKeys.detail(id)`. The round-trip fan-out that used to cost is
  gone — see "Job updates are batched" above — but the payload is
  unchanged: `getJobs` returns the full `Job` (args, claim, steps) for
  every row, where a nested view renders two fields. Trimming it means
  a second cache shape for `detail(id)`, which `JobDetail` also reads,
  so it needs its own key rather than a narrower read. Not worth it
  until a batch's size, rather than its count, shows up in metrics.
- **`hmm` has no push domain.** Task-nested sites
  (`references/components/ReferenceItem.tsx`,
  `references/components/Detail/Remote.tsx`,
  `hmm/components/HmmInstall.tsx`) now keep live task `progress`/`step`
  fresh by mounting `useFetchTask(id)` seeded with the nested task, so
  a `tasks` update frame invalidates `taskQueryKeys.detail(id)` and
  refetches through the `getTask` server function. `hmm` itself is not
  an `SseDomain` and has no `/hmms` refetch trigger; `HmmInstall`
  bridges that gap by watching the live task's `complete` and
  invalidating `hmmQueryKeys.lists()` from a `useEffect`. If HMM gains
  its own push domain, drop that effect in favour of a direct
  invalidation.
