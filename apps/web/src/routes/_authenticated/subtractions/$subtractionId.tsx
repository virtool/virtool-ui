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
	component: SubtractionRoute,
});

function SubtractionRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SubtractionDetail
			openEditSubtraction={Boolean(search.openEditSubtraction)}
			openRemoveSubtraction={Boolean(search.openRemoveSubtraction)}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
