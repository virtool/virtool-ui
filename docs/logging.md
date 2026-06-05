# Logging

## Use `@virtool/logger`, not `console`

Server code should log through the package, not `console.*`. It wraps pino
with sane defaults: JSON output, redaction of `password` / `token` /
`secret` / `authorization` / `cookie` (and the `req.headers.*` /
`headers.*` variants), level resolved from `VT_LOG_LEVEL` (falling back to
`info` in production, `debug` elsewhere).

The web app constructs one logger at bootstrap with a service `name`
(`apps/web/src/server/logger.ts` exports it as `web`). Inside request
handling reach for `ctx.logger` rather than re-importing the singleton,
and spawn a child for per-request context:

```ts
const log = ctx.logger.child({ requestId })
log.info({ userId }, 'login')
```

Pass structured fields as the first arg, message as the second — never
interpolate values into the message string, that defeats the redaction
list and makes records ungreppable.

The default redaction paths are defined in
`packages/logger/src/config.ts` (`DEFAULT_REDACT_PATHS`). Extra paths can
be merged in via the `redact` option to `createLogger` when a feature
needs to censor additional fields.

## Sentry forwarding

When `VT_SENTRY_DSN` is set, the server logger fans `warn`-and-above
records out to Sentry's structured logging API (`Sentry.logger`) in
addition to stdout. `info` and below stay stdout-only — dashboards and
logs are the source of truth for those; Sentry is reserved for `warn`
and worse. There is no per-call-site wiring: every record at or above
that threshold is forwarded automatically.

This is a plain pino destination stream
(`apps/web/src/server/sentryLog.ts`), **not**
`Sentry.pinoIntegration()`. The integration patches the `pino` module at
load time via `import-in-the-middle`, but the production server is bundled
(Nitro inlines pino into the server chunks), so there is no module
boundary left to patch. A destination stream needs no patching — pino
hands it each serialised record directly.

Wiring:

- `apps/web/src/instrument.server.ts` calls `Sentry.init` (with
  `enableLogs: true`, from `@virtool/sentry`'s `getCommonOptions`). It is
  imported for its side effect at the top of `apps/web/src/server.ts`.
- `apps/web/src/server/logger.ts` adds the Sentry stream to the logger
  only when a DSN is present, via `@virtool/logger`'s `streams` option.
  The `@sentry/*` SDK is loaded lazily (dynamic `import`) so it is never
  pulled in when no DSN is configured.

Redaction still applies. pino runs `DEFAULT_REDACT_PATHS` redaction before
writing to any destination, so the records the Sentry stream receives
already have `password` / `token` / `secret` / `authorization` / `cookie`
(and the `req.headers.*` / `headers.*` variants) replaced with
`[redacted]`.

Dev does not forward. The Tilt dev container runs Vite with no DSN, so the
logger stays stdout-only and the Sentry SDK is never loaded.
