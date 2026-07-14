import SamplesSettings from "@samples/components/SampleSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/settings")({
	loader: async ({ context: { queryClient } }) => {
		const { settingsQueryOptions } = await import("@administration/queries");
		await queryClient.ensureQueryData(settingsQueryOptions());
	},
	component: SamplesSettings,
});
