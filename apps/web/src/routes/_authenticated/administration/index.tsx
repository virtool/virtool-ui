import { accountQueryOptions } from "@account/queries";
import { hasSufficientAdminRole } from "@administration/utils";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administration/")({
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;

		const account = await queryClient.ensureQueryData(accountQueryOptions());

		if (hasSufficientAdminRole("settings", account.administrator_role)) {
			throw redirect({ to: "/administration/settings" });
		}

		throw redirect({ to: "/administration/users" });
	},
});
