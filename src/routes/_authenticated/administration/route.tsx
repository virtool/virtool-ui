import { fetchAccount } from "@account/api";
import { accountKeys, useFetchAccount } from "@account/queries";
import AdministrationTabs from "@administration/components/AdministrationTabs";
import { hasSufficientAdminRole } from "@administration/utils";
import ContainerNarrow from "@base/ContainerNarrow";
import ContainerWide from "@base/ContainerWide";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administration")({
	beforeLoad: async ({ context }) => {
		const { queryClient } = context;

		const account = await queryClient.ensureQueryData({
			queryKey: accountKeys.all(),
			queryFn: fetchAccount,
		});

		if (!hasSufficientAdminRole("users", account.administrator_role)) {
			throw redirect({ to: "/" });
		}
	},
	component: AdministrationLayout,
});

function AdministrationLayout() {
	const { data: account } = useFetchAccount();

	return (
		<ContainerWide>
			<ViewHeader title="Administration">
				<ViewHeaderTitle>Administration</ViewHeaderTitle>
			</ViewHeader>
			<AdministrationTabs administratorRole={account.administrator_role} />
			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</ContainerWide>
	);
}
