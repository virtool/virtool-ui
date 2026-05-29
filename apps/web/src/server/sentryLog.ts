import * as Sentry from "@sentry/tanstackstart-react";

type SentryLogMethod = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

// pino serialises levels as numbers; map them onto Sentry's logging methods.
const LEVEL_METHODS: Record<number, SentryLogMethod> = {
	10: "trace",
	20: "debug",
	30: "info",
	40: "warn",
	50: "error",
	60: "fatal",
};

const ENVELOPE_FIELDS = new Set([
	"level",
	"time",
	"pid",
	"hostname",
	"name",
	"msg",
]);

/**
 * A pino destination that forwards each record to Sentry's structured logging
 * API. pino applies redaction before any destination sees the record, so the
 * secret-bearing fields in `DEFAULT_REDACT_PATHS` arrive here already censored.
 * The standard pino envelope fields are dropped; everything else rides along as
 * Sentry log attributes.
 */
export function createSentryLogStream(): { write(line: string): void } {
	return {
		write(line) {
			let record: Record<string, unknown>;
			try {
				record = JSON.parse(line);
			} catch {
				return;
			}

			const method = LEVEL_METHODS[record.level as number] ?? "info";
			const message = typeof record.msg === "string" ? record.msg : "";

			const attributes: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(record)) {
				if (!ENVELOPE_FIELDS.has(key)) {
					attributes[key] = value;
				}
			}

			Sentry.logger[method](message, attributes);
		},
	};
}
