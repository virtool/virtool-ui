import ReferenceManager from "@references/components/Detail/ReferenceManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/$refId/manage")({
	component: ReferenceManager,
});
