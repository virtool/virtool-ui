import Segments from "@otus/components/Detail/Segments";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/segments",
)({
	component: Segments,
});
