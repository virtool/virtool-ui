import JobDetail from "@jobs/components/JobDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/jobs/$jobId")({
	component: JobDetail,
});
