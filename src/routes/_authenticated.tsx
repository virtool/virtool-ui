import { fetchAccount } from "@account/api";
import { accountKeys } from "@account/queries";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchRoot } from "@wall/api";
import { rootKeys } from "@wall/queries";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;

		const rootData = await queryClient.ensureQueryData({
			queryKey: rootKeys.all(),
			queryFn: fetchRoot,
		});

		if (rootData.first_user) {
			throw redirect({ to: "/setup" });
		}

		try {
			await queryClient.ensureQueryData({
				queryKey: accountKeys.all(),
				queryFn: fetchAccount,
			});
		} catch {
			throw redirect({ to: "/login" });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return <Outlet />;
}
