import bcrypt from "bcrypt";
import { z } from "zod";

// Bcrypt cost factor. Matches the value passlib uses on the Python side. The
// `$2b$12$...` hashes already present in the shared `users` table were
// generated with this cost, and any new hashes we write must keep it.
const COST = 12;

// Still hardcoded, but no longer because it has to be: the
// `minimum_password_length` instance setting is readable from Postgres via
// `getSettings`. VIR-2743 replaces this constant with the configured value,
// which means threading a database read into password validation.
export const MINIMUM_PASSWORD_LENGTH = 8;

/**
 * Rule for a password being set. Not applied at login: a user whose stored
 * password predates this rule must still be able to authenticate, or they
 * could never reach the forced-reset flow that would replace it.
 */
export const passwordSchema = z
	.string()
	.min(
		MINIMUM_PASSWORD_LENGTH,
		`Password does not meet minimum length requirement (${MINIMUM_PASSWORD_LENGTH})`,
	);

export async function hashPassword(plain: string): Promise<Buffer> {
	return Buffer.from(await bcrypt.hash(plain, COST), "utf8");
}

export async function verifyPassword(
	plain: string,
	hash: Buffer,
): Promise<boolean> {
	return bcrypt.compare(plain, hash.toString("utf8"));
}
