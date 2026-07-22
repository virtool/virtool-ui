import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { adminRole, open } from "../auth/policy";

import { db } from "../db/pg";
import type { SampleGroup } from "../db/schema/settings";
import {
	getSettings as getSettingsImpl,
	type Settings as SettingsRecord,
	updateSettings as updateSettingsImpl,
} from "./data";

/** The password rules a client needs to validate a new password before submitting it. */
export type PasswordPolicy = {
	minimumPasswordLength: number;
};

/**
 * Password policy server function. Unauthenticated by necessity — the
 * forced-reset and first-user forms both set a password before any session
 * exists, and they can only apply the configured minimum if they can read it.
 *
 * It returns the minimum length alone rather than the settings row. The rest of
 * that row is instance configuration that no unauthenticated caller has any
 * business reading.
 */
export const getPasswordPolicyFn = createServerFn({ method: "GET" })
	.middleware([open()])
	.handler(async (): Promise<PasswordPolicy> => {
		const { minimumPasswordLength } = await getSettingsImpl(db);
		return { minimumPasswordLength };
	});

/** Instance-wide settings, in the snake_case shape the client consumes. */
type Settings = {
	default_source_types: string[];
	enable_api: boolean;
	enable_sentry: boolean;
	minimum_password_length: number;
	sample_all_read: boolean;
	sample_all_write: boolean;
	sample_group: string;
	sample_group_read: boolean;
	sample_group_write: boolean;
};

const sampleGroups: readonly SampleGroup[] = [
	"none",
	"force_choice",
	"users_primary_group",
];

const updateSettingsSchema = z
	.object({
		default_source_types: z.array(z.string()).optional(),
		enable_api: z.boolean().optional(),
		enable_sentry: z.boolean().optional(),
		minimum_password_length: z.number().int().min(1).optional(),
		sample_all_read: z.boolean().optional(),
		sample_all_write: z.boolean().optional(),
		sample_group: z
			.string()
			.refine(
				(value): value is SampleGroup =>
					(sampleGroups as readonly string[]).includes(value),
				{ message: "Invalid sample group." },
			)
			.optional(),
		sample_group_read: z.boolean().optional(),
		sample_group_write: z.boolean().optional(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one setting must be provided.",
	});

function toWireSettings(settings: SettingsRecord): Settings {
	return {
		default_source_types: settings.defaultSourceTypes,
		enable_api: settings.enableApi,
		enable_sentry: settings.enableSentry,
		minimum_password_length: settings.minimumPasswordLength,
		sample_all_read: settings.sampleAllRead,
		sample_all_write: settings.sampleAllWrite,
		sample_group: settings.sampleGroup,
		sample_group_read: settings.sampleGroupRead,
		sample_group_write: settings.sampleGroupWrite,
	};
}

function toSettingsRecord(
	data: z.infer<typeof updateSettingsSchema>,
): Partial<SettingsRecord> {
	const values: Partial<SettingsRecord> = {};

	if (data.default_source_types !== undefined) {
		values.defaultSourceTypes = data.default_source_types;
	}
	if (data.enable_api !== undefined) {
		values.enableApi = data.enable_api;
	}
	if (data.enable_sentry !== undefined) {
		values.enableSentry = data.enable_sentry;
	}
	if (data.minimum_password_length !== undefined) {
		values.minimumPasswordLength = data.minimum_password_length;
	}
	if (data.sample_all_read !== undefined) {
		values.sampleAllRead = data.sample_all_read;
	}
	if (data.sample_all_write !== undefined) {
		values.sampleAllWrite = data.sample_all_write;
	}
	if (data.sample_group !== undefined) {
		values.sampleGroup = data.sample_group;
	}
	if (data.sample_group_read !== undefined) {
		values.sampleGroupRead = data.sample_group_read;
	}
	if (data.sample_group_write !== undefined) {
		values.sampleGroupWrite = data.sample_group_write;
	}

	return values;
}

export const getSettings = createServerFn({ method: "GET" })
	.middleware([adminRole("settings")])
	.handler(
		async (): Promise<Settings> => toWireSettings(await getSettingsImpl(db)),
	);

export const updateSettings = createServerFn({ method: "POST" })
	.middleware([adminRole("settings")])
	.validator(updateSettingsSchema)
	.handler(
		async ({ data }): Promise<Settings> =>
			toWireSettings(await updateSettingsImpl(db, toSettingsRecord(data))),
	);
