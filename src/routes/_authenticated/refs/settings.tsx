import ReferenceSettings from "@references/components/ReferenceSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/settings")({
	component: ReferenceSettings,
});
