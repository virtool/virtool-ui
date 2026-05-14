import Container from "@base/Container";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs")({
	component: RefsLayout,
});

function RefsLayout() {
	return (
		<Container>
			<Outlet />
		</Container>
	);
}
