import { settingsQueryOptions } from "@administration/queries";
import SamplesSettings from "@samples/components/SampleSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/settings")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData(settingsQueryOptions());
	},
	component: SamplesSettings,
});
