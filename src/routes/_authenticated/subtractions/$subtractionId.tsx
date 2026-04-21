import SubtractionDetail from "@subtraction/components/Detail/SubtractionDetail";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const subtractionDetailSearchSchema = z.object({
	openEditSubtraction: z.boolean().optional().catch(undefined),
	openRemoveSubtraction: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute(
	"/_authenticated/subtractions/$subtractionId",
)({
	validateSearch: subtractionDetailSearchSchema,
	component: SubtractionDetail,
});
