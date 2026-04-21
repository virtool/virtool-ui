import Container from "@base/Container";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/ml")({
	component: MlLayout,
});

function MlLayout() {
	return (
		<Container>
			<Outlet />
		</Container>
	);
}
