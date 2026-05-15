import Container from "@base/Container";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples")({
	component: SamplesLayout,
});

function SamplesLayout() {
	return (
		<Container>
			<Outlet />
		</Container>
	);
}
