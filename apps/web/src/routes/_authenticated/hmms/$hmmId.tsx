import HmmDetail from "@hmm/components/HmmDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/hmms/$hmmId")({
	component: HmmDetail,
});
