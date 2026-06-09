export const SENTRY_DSN_ENV = "VT_SENTRY_DSN";

export function readDsn(): string | undefined {
	const value = process.env[SENTRY_DSN_ENV];
	return value && value.length > 0 ? value : undefined;
}

/** Shared Sentry options for server-side SDK initialisation. */
export type CommonSentryOptions = {
	dsn: string | undefined;
	environment: string;
	sendDefaultPii: boolean;
	tracesSampleRate: number;
	profilesSampleRate: number;
	enableLogs: boolean;
};

export function getCommonOptions(): CommonSentryOptions {
	const environment = process.env.NODE_ENV ?? "development";
	const isProd = environment === "production";
	return {
		dsn: readDsn(),
		environment,
		sendDefaultPii: true,
		tracesSampleRate: isProd ? 0.1 : 1.0,
		// Relative to traced transactions, so the effective profiling rate is
		// tracesSampleRate * profilesSampleRate.
		profilesSampleRate: isProd ? 0.5 : 1.0,
		enableLogs: true,
	};
}
