import SamplesSettings from "@samples/components/SampleSettings";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/settings")({
	component: SamplesSettings,
});
