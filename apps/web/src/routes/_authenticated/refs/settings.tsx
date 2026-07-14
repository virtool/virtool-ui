import ReferenceSettings from "@references/components/ReferenceSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/refs/settings")({
	loader: async ({ context: { queryClient } }) => {
		const { settingsQueryOptions } = await import("@administration/queries");
		await queryClient.ensureQueryData(settingsQueryOptions());
	},
	component: ReferenceSettings,
});
