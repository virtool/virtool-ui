import OtuSection from "@otus/components/Detail/OtuSection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/otu",
)({
	component: OtuSection,
});
