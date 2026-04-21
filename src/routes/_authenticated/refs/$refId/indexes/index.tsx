import Indexes from "@indexes/components/Indexes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/$refId/indexes/")({
	component: Indexes,
});
