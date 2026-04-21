import { MLModels } from "@ml/components/MLModels";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/ml/")({
	component: MLModels,
});
