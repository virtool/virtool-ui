import { oneOfOptional, strOptional } from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginWall from "@wall/components/LoginWall";

function isSafeRedirect(value: string): boolean {
	return (
		value.startsWith("/") &&
		!value.startsWith("//") &&
		!value.startsWith("/login")
	);
}

/** Search params for the login wall. */
type LoginSearch = {
	reason?: "session-ended";
	redirect?: string;
};

function validateLoginSearch(
	input: Partial<LoginSearch> & SearchSchemaInput,
): LoginSearch {
	const target = strOptional(input.redirect);

	return {
		reason: oneOfOptional(input.reason, ["session-ended"] as const),
		redirect: target && isSafeRedirect(target) ? target : undefined,
	};
}

export const Route = createFileRoute("/login")({
	validateSearch: validateLoginSearch,
	beforeLoad: async ({ context, search }) => {
		const { queryClient } = context;
		const { accountQueryOptions } = await import("@account/account");

		try {
			await queryClient.ensureQueryData(accountQueryOptions());
		} catch {
			return;
		}

		throw redirect({ to: search.redirect ?? "/" });
	},
	// The forced-reset form this route can render sets a password before there is
	// a session, so it needs the policy up front. prefetchQuery rather than
	// ensureQueryData: a failed policy read must not take down the wall.
	loader: async ({ context }) => {
		const { passwordPolicyQueryOptions } = await import(
			"@administration/passwordPolicy"
		);
		return context.queryClient.prefetchQuery(passwordPolicyQueryOptions());
	},
	component: LoginWall,
});
