import Groups from "@groups/components/Groups";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administration/groups")({
	component: Groups,
});
