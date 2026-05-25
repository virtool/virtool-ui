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

Not currently wired. When the server bootstrap registers
`Sentry.pinoIntegration()`, logs at `info` and above will be forwarded to
Sentry whenever a DSN is set, with no extra wiring at call sites.
