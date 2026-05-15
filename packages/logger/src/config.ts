/** Env var read by `resolveLevel` to override the default log level. */
export const LOG_LEVEL_ENV = "VT_LOG_LEVEL";

/** Pino-compatible log level names. */
export type LogLevel =
	| "fatal"
	| "error"
	| "warn"
	| "info"
	| "debug"
	| "trace"
	| "silent";

const VALID_LEVELS: ReadonlySet<string> = new Set([
	"fatal",
	"error",
	"warn",
	"info",
	"debug",
	"trace",
	"silent",
]);

type Env = Record<string, string | undefined>;

export function resolveLevel(env: Env): LogLevel {
	const explicit = env[LOG_LEVEL_ENV];
	if (explicit && VALID_LEVELS.has(explicit)) {
		return explicit as LogLevel;
	}
	return env.NODE_ENV === "production" ? "info" : "debug";
}

/**
 * Keys redacted from log records by default. Covers the obvious secret-bearing
 * fields plus common HTTP shapes (`req.headers.authorization`, `headers.cookie`)
 * so that incidental request logging does not leak credentials.
 */
export const DEFAULT_REDACT_PATHS: readonly string[] = [
	"password",
	"token",
	"secret",
	"authorization",
	"cookie",
	"*.password",
	"*.token",
	"*.secret",
	"*.authorization",
	"*.cookie",
	"req.headers.authorization",
	"req.headers.cookie",
	"headers.authorization",
	"headers.cookie",
];
