import Indexes from "@indexes/components/Indexes";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const indexesSearchSchema = z.object({
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/indexes/")({
	validateSearch: indexesSearchSchema,
	component: IndexesRoute,
});

function IndexesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<Indexes
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
