import OtuHistory from "@otus/components/Detail/History/OtuHistory";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/history",
)({
	component: OtuHistory,
});
