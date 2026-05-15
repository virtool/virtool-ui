import ReferenceList from "@references/components/ReferenceList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const refsSearchSchema = z.object({
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
	createReferenceType: z.string().optional().catch(undefined),
	cloneReferenceId: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/")({
	validateSearch: refsSearchSchema,
	component: ReferencesRoute,
});

function ReferencesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ReferenceList
			cloneReferenceId={search.cloneReferenceId}
			createReferenceType={search.createReferenceType}
			find={search.find}
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
