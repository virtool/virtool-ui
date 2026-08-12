# Metrics

Each Virtool service — `apps/web`, `apps/jobs-api`, `apps/tasks` — exposes
Prometheus metrics at `GET /metrics`, in the text exposition format, from
its own process-wide registry. Series names deliberately match across
services so one dashboard covers all of them, and a series is told apart
by the scrape's target labels and by `application_name`, **never** by
renaming it.

A series belongs on the registry of the process that can answer for it
cheaply and completely, not on every process that might find it useful.
See [apps/web/README.md](../apps/web/README.md#metrics),
[apps/jobs-api/README.md](../apps/jobs-api/README.md#metrics) and
[tasks.md](tasks.md) for what each one emits and why.

## What every implementation shares

- **The same three-state gate.** `VT_METRICS_TOKEN` unset or empty → `404`
  (metrics are off until a deployment opts in); set and the request
  carries no valid `Authorization: Bearer <token>` → `401` with a
  `WWW-Authenticate: Bearer` header; a valid token → the scrape. All three
  read the token through the standard `<KEY>_FILE` convention.
- **One comparison function.** The token check is `isBearerTokenValid`
  from `@virtool/contracts/bearer` — constant-time, RFC 9110
  case-insensitive on the scheme, byte-exact on the credential — imported
  by all three rather than reimplemented.
- **A registry built by a factory, not a module-scope singleton.** Each
  service's registry (and every gauge/counter/histogram on it) is
  constructed by a function called once at startup — `createMetrics` in
  `apps/jobs-api` and `apps/tasks`, the module-level build in
  `apps/web/src/server/metrics/registry.ts` — taking its inputs
  (`poolMax`, `version`) as arguments rather than reading configuration
  itself. A test gets its own registry and cannot see what another suite
  registered.
- **Unprefixed defaults, `virtool_`-prefixed everything else.**
  `collectDefaultMetrics` keeps prom-client's standard `process_*` /
  `nodejs_*` names so off-the-shelf Node dashboards match them; every
  metric a service defines itself is prefixed `virtool_`.
- **No label may be unbounded**, and where the database leaves a column
  open (`jobs.workflow`, `tasks.type` — plain `text`, no constraint) the
  registry folds an unrecognised value into a fixed `other` label rather
  than trusting the schema to bound it.
- **A backlog gauge is zeroed across its whole label cross product before
  being overwritten from a fresh read.** `virtool_jobs` /
  `virtool_jobs_oldest_pending_age_seconds` (jobs API) and `virtool_tasks`
  / `virtool_tasks_oldest_queued_age_seconds` (tasks) both do this,
  because a gauge holds its last value forever and a drained queue must
  report zero rather than its final backlog.
- **A failed or slow pre-scrape read degrades, never fails, the scrape.**
  Postgres pool occupancy (`readConnectionCountsBounded`, shared from
  `@virtool/data/metrics/data`, bounded at `POOL_PROBE_TIMEOUT_MS` = 2 s)
  and, where present, a queue read are independent of each other and of
  process-metric collection: one failing logs a warning and drops only
  the series it feeds.
- **`application_name` is what scopes a pool reading to one process.**
  `buildApplicationName(service, hostname)` (`@virtool/data/db/applicationName`)
  is what `createDb(config, service)` sets on every connection, and it is
  the same mechanism — not a per-service reimplementation — behind every
  `virtool_postgres_connections` series that exists.

## Where the implementations diverge

Some divergence is deliberate and documented at the source: `apps/tasks`
carries no `virtool_http_*` series because it serves nothing but probes
and a scrape, and its `virtool_task_duration_seconds` buckets (1 s–2 h)
are deliberately not the `virtool_http_*` buckets (5 ms–10 s), because
task and request durations are different orders of magnitude.

The rest is drift rather than decision, and worth reconciling:

- **`virtool_http_requests_total` / `virtool_http_request_duration_seconds`
  carry different label sets on the two services that emit them.**
  `apps/web` labels with `handler_type, method, status, server_fn`;
  `apps/jobs-api` labels with `route, method, status`. Same metric name,
  incompatible schema — a query grouping by `route` returns nothing
  against the web target, and one grouping by `server_fn` returns nothing
  against the jobs API. The histogram buckets do match exactly
  (`[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]`) — but as
  two independently hardcoded literals, not a shared constant, so nothing
  stops them drifting apart the way `POOL_PROBE_TIMEOUT_MS` is protected
  from drifting.
- **`virtool_app_info{version}` is missing from `apps/jobs-api`.** Both
  `apps/web` and `apps/tasks` publish it so a query can correlate a
  behaviour change with the deploy that caused it; the jobs API's
  registry never registers the gauge.
- **Postgres pool occupancy is missing from `apps/tasks`.** It opens a
  named pool through the same `createDb(config, "tasks")` /
  `buildApplicationName` mechanism as the other two, and the same shared
  `readConnectionCountsBounded` helper (`@virtool/data/metrics/data`)
  that both other services call is right there to reuse — but nothing in
  `apps/tasks/src/metrics/registry.ts` or `handler.ts` wires it up, so a
  saturated pool on the task runner's claim/heartbeat loop is invisible
  where it would be caught immediately on the other two services.
- **The bounded, memoized, in-flight-shared "queue reader ahead of a
  scrape" exists twice, almost verbatim** —
  `createJobQueueReader` (`apps/jobs-api/src/metrics/jobs.ts`) and
  `createTaskQueueReader` (`apps/tasks/src/metrics/queue.ts`) — including
  the same 10-second TTL declared as an independent constant in each
  file (`JOB_QUEUE_TTL_MS` / `TASK_QUEUE_TTL_MS`). The two values
  matching today is coincidence, not a guarantee; neither is factored
  into `@virtool/data` the way the pool-probe timeout is.
- **`status="error"` is triggered by different conditions per framework.**
  In `apps/web`, `metricsMiddleware` records `"error"` for *any* throw
  that escapes the downstream handler chain, ordinary `Error`s included.
  In `apps/jobs-api`, an ordinary `Error` is already turned into an
  explicit `500` by Hono's `onError` before the metrics middleware's
  `finally` runs, so it is recorded as `status="500"` — `"error"` there
  only fires for the rarer non-`Error` throw that `onError`'s
  `err instanceof Error` guard misses. Both are internally consistent
  with "no response was produced," but an alert on `status="error"`
  across both targets would fire at very different rates for the same
  underlying failure mode.
