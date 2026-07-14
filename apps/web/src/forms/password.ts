import { passwordPolicyQueryOptions } from "@administration/queries";
import {
	DEFAULT_MINIMUM_PASSWORD_LENGTH,
	formatMinimumPasswordLengthMessage,
} from "@server/auth/passwordPolicy";
import { useQuery } from "@tanstack/react-query";

/** react-hook-form rules for a field that sets a new password. */
export type PasswordRules = {
	required: string;
	minLength: { value: number; message: string };
};

/**
 * Rules for a field that sets a new password, enforcing the instance's
 * configured minimum length.
 *
 * Falls back to the default minimum while the policy is in flight or if its
 * request failed. The server enforces the configured value on submit either
 * way, so a missing policy can only make this check more permissive than the
 * server's — never stricter, which would block a password the server accepts.
 */
export function usePasswordRules(): PasswordRules {
	const { data } = useQuery(passwordPolicyQueryOptions());

	const minimum =
		data?.minimumPasswordLength ?? DEFAULT_MINIMUM_PASSWORD_LENGTH;
	const message = formatMinimumPasswordLengthMessage(minimum);

	return { required: message, minLength: { value: minimum, message } };
}
