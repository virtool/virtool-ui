import type { Settings } from "@administration/types";
import nock from "nock";

/**
 * Sets up a mocked API route for fetching the settings
 *
 * @param settings - The documents for settings
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSettings(settings: Settings) {
	return nock("http://localhost").get("/api/settings").reply(200, settings);
}

/**
 * Sets up a mocked API route for updating the settings
 *
 * @param settings - The updated documents for settings
 * @returns The nock scope for the mocked API call
 */
export function mockApiUpdateSettings(settings: Settings) {
	return nock("http://localhost").patch("/api/settings").reply(200, settings);
}
