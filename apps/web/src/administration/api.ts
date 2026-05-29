/**
 * Functions for requesting data required for managing virtool.
 *
 * @module account/api
 */
import { apiClient } from "@app/api";
import type { Settings } from "./types";

/**
 * Fetch the current settings from the server.
 *
 * @returns - A promise resolving to the current server settings.
 */
export function fetchSettings(): Promise<Settings> {
	return apiClient.get("/settings").then((response) => {
		return response.body;
	});
}

export type SettingsUpdate = {
	default_source_types?: string[];
	enable_api?: boolean;
	enable_sentry?: boolean;
	hmm_slug?: string;
	minimum_password_length?: number;
	sample_all_read?: boolean;
	sample_all_write?: boolean;
	sample_group?: string;
	sample_group_read?: boolean;
	sample_group_write?: boolean;
	sample_unique_names?: boolean;
};

/**
 * Update the current settings on the server.
 *
 * @returns - A promise resolving to the complete response containing the updated settings.
 */
export function updateSettings(update: SettingsUpdate): Promise<Settings> {
	return apiClient
		.patch("/settings")
		.send(update)
		.then((response) => response.body);
}
