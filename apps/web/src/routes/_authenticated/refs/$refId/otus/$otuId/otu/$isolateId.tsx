import IsolateDetail from "@otus/components/Detail/Isolates/IsolateDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/otu/$isolateId",
)({
	component: IsolateDetail,
});
