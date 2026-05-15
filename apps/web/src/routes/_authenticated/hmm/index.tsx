import HmmList from "@hmm/components/HmmList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const hmmSearchSchema = z.object({
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/hmm/")({
	validateSearch: hmmSearchSchema,
	component: HmmRoute,
});

function HmmRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<HmmList
			find={search.find}
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
