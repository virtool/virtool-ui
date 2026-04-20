import { fetchAccount } from "@account/api";
import { accountKeys } from "@account/queries";
import { apiClient } from "@app/api";
import type { Root } from "@app/types";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { rootKeys } from "@wall/queries";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;

		const rootData = await queryClient.ensureQueryData<Root>({
			queryKey: rootKeys.all(),
			queryFn: () => apiClient.get("/").then((res) => res.body),
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
