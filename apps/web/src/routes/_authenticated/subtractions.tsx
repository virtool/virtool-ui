import Container from "@base/Container";
import ContainerNarrow from "@base/ContainerNarrow";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/subtractions")({
	component: SubtractionsLayout,
});

function SubtractionsLayout() {
	return (
		<Container>
			<ContainerNarrow>
				<Outlet />
			</ContainerNarrow>
		</Container>
	);
}
