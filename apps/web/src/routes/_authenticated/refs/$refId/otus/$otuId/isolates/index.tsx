import IsolateList from "@otus/components/Detail/Isolates/IsolateList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/isolates/",
)({
	component: IsolateList,
});
