import { settingsQueryOptions } from "@administration/queries";
import ReferenceSettings from "@references/components/ReferenceSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/settings")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(settingsQueryOptions());
	},
	component: ReferenceSettings,
});
