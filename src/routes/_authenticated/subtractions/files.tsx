import { SubtractionFileManager } from "@subtraction/components/SubtractionFileManager";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/subtractions/files")({
	component: SubtractionFileManager,
});
