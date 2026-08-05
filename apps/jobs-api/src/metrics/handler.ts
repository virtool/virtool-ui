import { isBearerTokenValid } from "@virtool/contracts/bearer";
import type { PgClient } from "@virtool/data/db/pg";
import { readConnectionCounts } from "@virtool/data/metrics/data";
import type { Logger } from "@virtool/logger";
import type { Context } from "hono";
import type { Metrics } from "./registry";

/**
 * How long a scrape waits on the pool probe before abandoning it.
 *
 * The probe is a query on the very pool it measures, so a saturated pool queues
 * it *client-side*, where nothing rejects and no statement timeout applies.
 * Left unbounded it would hang past Prometheus' scrape deadline and lose the
 * whole response — the process and request metrics included — exactly when
 * saturation is the thing worth seeing. Two seconds sits well inside a default
 * 10s scrape timeout.
 */
const POOL_PROBE_TIMEOUT_MS = 2000;

/**
 * Resolve `promise`, or reject once `ms` have passed.
 *
 * The abandoned promise is left to settle on its own; it is a single trivial
 * query and its result is simply discarded.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const deadline = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error("timed out")), ms);
	});

	return Promise.race([promise, deadline]).finally(() => clearTimeout(timer));
}

/** What {@link handleMetrics} needs to answer a scrape. */
export type MetricsDeps = {
	metrics: Metrics;
	client: PgClient;
	applicationName: string;
	logger: Logger;
	token: string | undefined;
};

/**
 * Answer a Prometheus scrape at `GET /metrics`.
 *
 * This service is already unreachable from the internet, but the token is not
 * redundant: everything inside the cluster can reach a ClusterIP, and the
 * endpoint shares a socket with the API itself. With no token configured it
 * reports **404** rather than serving openly, so an existing deployment does
 * not start exposing internals on upgrade; with a token configured and a wrong
 * one presented it reports **401**.
 */
export async function handleMetrics(
	c: Context,
	deps: MetricsDeps,
): Promise<Response> {
	if (!deps.token) {
		return c.text("Not Found", 404);
	}

	if (!isBearerTokenValid(c.req.header("authorization"), deps.token)) {
		return c.text("Unauthorized", 401, { "www-authenticate": "Bearer" });
	}

	// A Postgres outage is exactly when the rest of these metrics matter most, so
	// a failed or slow read drops the pool gauges rather than the whole scrape.
	// The series go stale at their last value; `up` and the process metrics carry
	// on.
	try {
		deps.metrics.setPostgresConnections(
			await withTimeout(
				readConnectionCounts(deps.client, deps.applicationName),
				POOL_PROBE_TIMEOUT_MS,
			),
		);
	} catch (err) {
		deps.logger.warn({ err }, "could not read postgres connection counts");
	}

	return c.text(await deps.metrics.render(), 200, {
		"content-type": deps.metrics.contentType,
	});
}
