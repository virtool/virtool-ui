import Container from "@base/Container";
import ContainerNarrow from "@base/ContainerNarrow";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/hmm")({
	component: HmmLayout,
});

function HmmLayout() {
	return (
		<Container>
			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</Container>
	);
}
