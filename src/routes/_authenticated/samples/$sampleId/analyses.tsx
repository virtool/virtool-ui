import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses",
)({
	component: AnalysesLayout,
});

function AnalysesLayout() {
	return <Outlet />;
}
