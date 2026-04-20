import ServerSettings from "@administration/components/ServerSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/administration/settings")(
	{
		component: ServerSettings,
	},
);
