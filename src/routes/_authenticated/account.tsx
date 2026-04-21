import ContainerNarrow from "@base/ContainerNarrow";
import ContainerWide from "@base/ContainerWide";
import Tabs from "@base/Tabs";
import TabsLink from "@base/TabsLink";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account")({
	component: AccountLayout,
});

function AccountLayout() {
	return (
		<ContainerWide>
			<ViewHeader title="Account">
				<ViewHeaderTitle>Account</ViewHeaderTitle>
			</ViewHeader>

			<Tabs>
				<TabsLink to="/account/profile">Profile</TabsLink>
				<TabsLink to="/account/api">API</TabsLink>
			</Tabs>

			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</ContainerWide>
	);
}
