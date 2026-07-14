import AccountProfile from "@account/components/AccountProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/profile")({
	loader: async ({ context: { queryClient } }) => {
		const { passwordPolicyQueryOptions } = await import(
			"@administration/passwordPolicy"
		);
		return queryClient.prefetchQuery(passwordPolicyQueryOptions());
	},
	component: AccountProfile,
});
