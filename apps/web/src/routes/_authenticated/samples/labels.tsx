import { Labels } from "@labels/components/Labels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/labels")({
	component: Labels,
});
