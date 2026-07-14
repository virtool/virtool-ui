import nock from "nock";
import { afterEach, describe, expect, it, vi } from "vitest";

const endSession = vi.fn();

vi.mock("@app/session", () => ({
	armSessionEnd: vi.fn(),
	endSession,
}));

// The test setup pulls `@app/api` in through the account queries, so the cached
// copy is bound to the real session module. Re-evaluate it against the mock.
async function loadApiClient() {
	vi.resetModules();
	const { apiClient } = await import("../api");

	return apiClient;
}

describe("apiClient", () => {
	afterEach(() => {
		nock.cleanAll();
		endSession.mockClear();
	});

	it("ends the session when the API rejects a request as unauthorized", async () => {
		nock("http://localhost").get("/api/account").reply(401, {});
		const apiClient = await loadApiClient();

		await expect(apiClient.get("/account")).rejects.toThrow();

		expect(endSession).toHaveBeenCalledTimes(1);
	});

	it("leaves the session alone when a request fails for any other reason", async () => {
		nock("http://localhost").get("/api/samples").reply(500, {});
		const apiClient = await loadApiClient();

		await expect(apiClient.get("/samples")).rejects.toThrow();

		expect(endSession).not.toHaveBeenCalled();
	});

	it("leaves the session alone when a request succeeds", async () => {
		nock("http://localhost").get("/api/samples").reply(200, []);
		const apiClient = await loadApiClient();

		await apiClient.get("/samples");

		expect(endSession).not.toHaveBeenCalled();
	});
});
