import type { Connection } from "mongoose";
import type { PgClient } from "../db/pg";
import { logger } from "../logger";

const CHECK_TIMEOUT_MS = 5_000;

/** The result of probing a single backing store. */
export type StoreCheck = {
	ok: boolean;
};

/** A readiness verdict over every backing store, with the HTTP status to report. */
export type ReadyReport = {
	status: "ready" | "unavailable";
	statusCode: 200 | 503;
	checks: { mongo: StoreCheck; postgres: StoreCheck };
};

/** Fold per-store checks into a single ready/unavailable verdict. */
export function summarizeReadiness(
	mongo: StoreCheck,
	postgres: StoreCheck,
): ReadyReport {
	const ok = mongo.ok && postgres.ok;

	return {
		status: ok ? "ready" : "unavailable",
		statusCode: ok ? 200 : 503,
		checks: { mongo, postgres },
	};
}

/** Reject if `promise` does not settle within `ms` milliseconds. */
function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer = setTimeout(() => {
			reject(new Error(`health check timed out after ${ms}ms`));
		}, ms);

		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(err) => {
				clearTimeout(timer);
				reject(err);
			},
		);
	});
}

/** Probe Postgres with a trivial query. Never throws. */
export async function checkPostgres(client: PgClient): Promise<StoreCheck> {
	try {
		await withTimeout(client`SELECT 1`, CHECK_TIMEOUT_MS);
		return { ok: true };
	} catch (err) {
		logger.warn({ err }, "postgres health check failed");
		return { ok: false };
	}
}

/** Probe Mongo with a server ping. Never throws. */
export async function checkMongo(connection: Connection): Promise<StoreCheck> {
	const admin = connection.db?.admin();
	if (!admin) {
		// Expected transient race on cold start: the readiness probe can fire
		// before the Mongoose connection finishes opening. Not a failure worth
		// warning about.
		logger.info("mongo connection is not ready");
		return { ok: false };
	}

	try {
		await withTimeout(admin.ping(), CHECK_TIMEOUT_MS);
		return { ok: true };
	} catch (err) {
		logger.warn({ err }, "mongo health check failed");
		return { ok: false };
	}
}
