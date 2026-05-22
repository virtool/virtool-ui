export const SENTRY_DSN_ENV = "VT_SENTRY_DSN";

type ImportMetaEnv = Record<string, string | undefined>;

export function readDsn(env: ImportMetaEnv): string | undefined {
	const value = env[SENTRY_DSN_ENV];
	return value && value.length > 0 ? value : undefined;
}

export type CommonBrowserSentryOptions = {
	dsn: string | undefined;
	environment: string;
	sendDefaultPii: boolean;
	tracesSampleRate: number;
	replaysSessionSampleRate: number;
	replaysOnErrorSampleRate: number;
	enableLogs: boolean;
};

export function getCommonOptions(
	env: ImportMetaEnv,
): CommonBrowserSentryOptions {
	const environment = env.MODE ?? "development";
	const isProd = environment === "production";
	return {
		dsn: readDsn(env),
		environment,
		sendDefaultPii: true,
		tracesSampleRate: isProd ? 0.1 : 1.0,
		replaysSessionSampleRate: isProd ? 0.1 : 0,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: true,
	};
}
