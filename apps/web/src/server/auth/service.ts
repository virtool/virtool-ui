import type { Db } from "../db/pg";
import { getSettings } from "../settings/data";
import { checkPasswordLength } from "./passwordPolicy";

/**
 * Check a password being set against the instance's configured minimum length,
 * throwing `PasswordTooShortError` if it falls short.
 *
 * Every path that sets a password goes through this rather than through the zod
 * validators. A validator runs before its handler with no database handle, so it
 * cannot read the configured minimum — and its rejections surface as a 500
 * carrying a dump of the issue list, which is not something a form can put in
 * front of a user.
 */
export async function checkConfiguredPasswordLength(
	db: Db,
	password: string,
): Promise<void> {
	const { minimumPasswordLength } = await getSettings(db);
	checkPasswordLength(password, minimumPasswordLength);
}
