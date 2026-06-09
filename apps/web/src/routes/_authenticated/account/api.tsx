import ApiKeys from "@account/components/ApiKeys";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/account/api")({
	component: ApiKeys,
});
