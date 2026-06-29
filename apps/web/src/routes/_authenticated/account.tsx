import ContainerNarrow from "@base/ContainerNarrow";
import ContainerWide from "@base/ContainerWide";
import NavTab from "@base/NavTab";
import NavTabs from "@base/NavTabs";
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

			<NavTabs>
				<NavTab to="/account/profile">Profile</NavTab>
				<NavTab to="/account/api">API</NavTab>
			</NavTabs>

			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</ContainerWide>
	);
}
