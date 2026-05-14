import SampleDetailFiles from "@samples/components/Files/SampleDetailFiles";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/$sampleId/files")(
	{
		component: SampleDetailFiles,
	},
);
