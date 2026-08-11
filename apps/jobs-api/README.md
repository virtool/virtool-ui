# @virtool/jobs-api

The jobs API: the service workflow runners call to claim, run and finish jobs.
A [Hono](https://hono.dev) app on `@hono/node-server`, port **9950**, mirroring
Python's `virtool/jobs/main.py`. It runs as `api-jobs-service` behind a
ClusterIP with **no ingress** — that absence is the security boundary.

Image: `ghcr.io/virtool/jobs-api`.

It serves records, never bytes: a read hands back the recorded `storageKey` and
the workflow fetches the object itself.

## Surface

| Group | Routes |
| --- | --- |
| Probes | `GET /health/live`, `GET /health/ready` |
| Metrics | `GET /metrics` (bearer, `VT_METRICS_TOKEN`) |
| Job lifecycle | `POST /jobs/claim`, `GET /jobs/{id}`, `PUT /jobs/{id}/ping`, `POST /jobs/{id}/steps/{stepId}/start`, `POST /jobs/{id}/finish` |
| Caches | `GET /caches/{key}`, `POST /caches` |
| Finalize | `PATCH /subtractions/{id}`, `PATCH /samples/{id}`, `PATCH /analyses/{id}` |
| Metadata | `GET /samples/{id}`, `/subtractions/{id}`, `/indexes/{id}`, `/analyses/{id}`, `/refs/{id}`, `/settings` |

There is no delete and no failure route. Cancelling a job, deleting one and the
five-minute stalled-job sweep all stay Python's.

Every route must refuse an unauthenticated caller or be named in
`PUBLIC_ROUTES`; `src/__tests__/authorization.test.ts` enforces that.

## Commands

Run from the monorepo root.

| Command | Action |
| --- | --- |
| `pnpm --filter @virtool/jobs-api build` | Bundle to `dist/index.mjs` |
| `pnpm --filter @virtool/jobs-api start` | Run the bundle |
| `pnpm --filter @virtool/jobs-api test` | Run the Vitest suite (needs Docker — Postgres testcontainer) |
| `pnpm --filter @virtool/jobs-api typecheck` | `tsc --noEmit` |

## Documentation

`docs/jobs-api.md` covers the routes, the auth model, the ownership and
finalize rules, config and metrics in full. `docs/apps.md` covers the bundling
and `pnpm deploy` pipeline every non-Vite app shares, and `docs/images.md` the
image pipeline.
