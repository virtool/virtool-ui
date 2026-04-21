import SampleFileManager from "@samples/components/SampleFileManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/files")({
	component: SampleFileManager,
});
