# Metrics

Each Virtool service — `apps/web`, `apps/jobs-api`, `apps/tasks` — exposes
Prometheus metrics at `GET /metrics`, in the text exposition format, from
its own process-wide registry. Series names deliberately match across
services so one dashboard covers all of them, and a series is told apart
by the scrape's target labels and by `application_name`, **never** by
renaming it.

A series belongs on the registry of the process that can answer for it
cheaply and completely, not on every process that might find it useful.

