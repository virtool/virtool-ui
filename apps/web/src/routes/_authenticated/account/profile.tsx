import AccountProfile from "@account/components/AccountProfile";
import { passwordPolicyQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/profile")({
	loader: ({ context: { queryClient } }) =>
		queryClient.prefetchQuery(passwordPolicyQueryOptions()),
	component: AccountProfile,
});
