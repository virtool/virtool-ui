import { createServerFn } from "@tanstack/react-start";
import { open } from "../auth/policy";

import { db } from "../db/pg";
import { getSettings } from "./data";

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
		const { minimumPasswordLength } = await getSettings(db);
		return { minimumPasswordLength };
	});
