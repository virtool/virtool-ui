export const SENTRY_DSN_ENV = "VT_SENTRY_DSN";

export function readDsn(): string | undefined {
	const value = process.env[SENTRY_DSN_ENV];
	return value && value.length > 0 ? value : undefined;
}

export type CommonSentryOptions = {
	dsn: string | undefined;
	environment: string;
	sendDefaultPii: boolean;
	tracesSampleRate: number;
	enableLogs: boolean;
};

export function getCommonOptions(): CommonSentryOptions {
	const environment = process.env.NODE_ENV ?? "development";
	return {
		dsn: readDsn(),
		environment,
		sendDefaultPii: true,
		tracesSampleRate: environment === "production" ? 0.1 : 1.0,
		enableLogs: true,
	};
}
