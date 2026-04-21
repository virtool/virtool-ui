import Container from "@base/Container";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/jobs")({
	component: JobsLayout,
});

function JobsLayout() {
	return (
		<Container>
			<Outlet />
		</Container>
	);
}
