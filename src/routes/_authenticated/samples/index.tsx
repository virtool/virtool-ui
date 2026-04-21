import SamplesList from "@samples/components/SamplesList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/")({
	component: SamplesList,
});
