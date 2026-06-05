import type { Connection } from "mongoose";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { PgClient } from "../../db/pg";
import { logger } from "../../logger";
import { checkMongo, checkPostgres, summarizeReadiness } from "../data";

vi.mock("../../logger", () => ({
	logger: { warn: vi.fn(), info: vi.fn() },
}));

function fakePgClient(result: () => PromiseLike<unknown>): PgClient {
	return (() => result()) as unknown as PgClient;
}

function fakeConnection(ping: (() => PromiseLike<unknown>) | null): Connection {
	return {
		db: ping ? { admin: () => ({ ping }) } : undefined,
	} as unknown as Connection;
}

describe("checkPostgres", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("reports ok when the query resolves", async () => {
		const client = fakePgClient(() => Promise.resolve([{ ok: 1 }]));
		expect(await checkPostgres(client)).toEqual({ ok: true });
	});

	it("reports not ok when the query rejects", async () => {
		const client = fakePgClient(() => Promise.reject(new Error("down")));
		expect(await checkPostgres(client)).toEqual({ ok: false });
	});

	it("reports not ok when the query exceeds the timeout", async () => {
		vi.useFakeTimers();
		const client = fakePgClient(() => new Promise(() => {}));
		const pending = checkPostgres(client);
		await vi.advanceTimersByTimeAsync(5_000);
		expect(await pending).toEqual({ ok: false });
	});
});

describe("checkMongo", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("reports ok when the ping resolves", async () => {
		const connection = fakeConnection(() => Promise.resolve({ ok: 1 }));
		expect(await checkMongo(connection)).toEqual({ ok: true });
	});

	it("logs at info, not warn, when the connection is not ready", async () => {
		const connection = fakeConnection(null);
		expect(await checkMongo(connection)).toEqual({ ok: false });
		expect(logger.info).toHaveBeenCalledTimes(1);
		expect(logger.warn).not.toHaveBeenCalled();
	});

	it("reports not ok when the ping rejects", async () => {
		const connection = fakeConnection(() => Promise.reject(new Error("down")));
		expect(await checkMongo(connection)).toEqual({ ok: false });
	});

	it("reports not ok when the ping exceeds the timeout", async () => {
		vi.useFakeTimers();
		const connection = fakeConnection(() => new Promise(() => {}));
		const pending = checkMongo(connection);
		await vi.advanceTimersByTimeAsync(5_000);
		expect(await pending).toEqual({ ok: false });
	});
});

describe("summarizeReadiness", () => {
	it("is ready with a 200 when both stores are ok", () => {
		expect(summarizeReadiness({ ok: true }, { ok: true })).toEqual({
			status: "ready",
			statusCode: 200,
			checks: { mongo: { ok: true }, postgres: { ok: true } },
		});
	});

	it("is unavailable with a 503 when mongo fails", () => {
		const report = summarizeReadiness({ ok: false }, { ok: true });
		expect(report.status).toBe("unavailable");
		expect(report.statusCode).toBe(503);
	});

	it("is unavailable with a 503 when postgres fails", () => {
		const report = summarizeReadiness({ ok: true }, { ok: false });
		expect(report.status).toBe("unavailable");
		expect(report.statusCode).toBe(503);
	});
});
