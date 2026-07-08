import ReferenceList from "@references/components/ReferenceList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const refsSearchSchema = z.object({
	archived: z.boolean().default(false).catch(false),
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
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
			archived={search.archived}
			cloneReferenceId={search.cloneReferenceId}
			find={search.find}
			page={search.page}
			setSearch={(next, options) =>
				navigate({
					search: { ...search, ...next },
					replace: options?.replace,
				})
			}
		/>
	);
}
