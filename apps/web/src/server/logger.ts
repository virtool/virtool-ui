import { createLogger, type Logger } from "@virtool/logger";
import { readDsn } from "@virtool/sentry";

// Only pull in the Sentry SDK when a DSN is configured. Without one (the Vite
// dev container, tests) the logger is stdout-only and the heavy `@sentry/node`
// graph — and its import-in-the-middle hooks — are never loaded.
const streams = readDsn()
	? [
			{
				level: "info" as const,
				stream: (await import("./sentryLog")).createSentryLogStream(),
			},
		]
	: undefined;

export const logger: Logger = createLogger({ name: "web", streams });
