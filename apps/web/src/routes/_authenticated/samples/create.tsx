import CreateSample from "@samples/components/Create/CreateSample";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/create")({
	component: CreateSample,
});
