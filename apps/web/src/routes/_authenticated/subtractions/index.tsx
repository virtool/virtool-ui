import SubtractionList from "@subtraction/components/SubtractionList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const subtractionsSearchSchema = z.object({
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
	openCreateSubtraction: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/subtractions/")({
	validateSearch: subtractionsSearchSchema,
	component: SubtractionsRoute,
});

function SubtractionsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SubtractionList
			find={search.find}
			openCreateSubtraction={Boolean(search.openCreateSubtraction)}
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
