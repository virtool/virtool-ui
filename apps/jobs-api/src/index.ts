import { serve } from "@hono/node-server";
import * as Sentry from "@sentry/node";
import { createDb, logPostgresVersion } from "@virtool/data/db/pg";
import { createEmitter } from "@virtool/data/events/emit";
import { createStorageBackend } from "@virtool/storage";
import { createApp } from "./app";
import { parseConfig } from "./config";
import { initSentry, SERVICE } from "./instrument";
import { createAppLogger } from "./logger";
import { createMetrics } from "./metrics/registry";

const config = parseConfig();

// Built first, and before `initSentry`, because everything below logs — and
// because the Sentry destination it attaches is decided by the same DSN.
const logger = createAppLogger(config.sentryDsn);

// Before the pool opens or the server listens, so Sentry's Node
// auto-instrumentation can install its import hooks ahead of what it patches.
initSentry(config.sentryDsn, logger);

const { client, db, applicationName } = createDb(config, SERVICE);

// Installs the process-wide client-event emitter. Every data function that
// mutates a row calls `emit`, which throws if nothing has been created — so
// without this the finalize and lifecycle routes answer 500 having already
// committed their work.
createEmitter({ client, logger });

const app = createApp({
	client,
	db,
	storage: createStorageBackend(config.storage),
	logger,
	metrics: createMetrics(config.postgresPoolMax),
	applicationName,
	metricsToken: config.metricsToken,
	captureException: Sentry.captureException,
});

logPostgresVersion(client, logger);

const server = serve(
	{ fetch: app.fetch, hostname: config.host, port: config.port },
	() => {
		logger.info({ host: config.host, port: config.port }, "listening");
	},
);

// A pod is deleted with SIGTERM. Close the listener and drain the pool so
// in-flight readiness probes finish rather than being cut off mid-query.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.on(signal, () => {
		logger.info({ signal }, "shutting down");
		server.close(() => {
			void client.end();
		});
	});
}
