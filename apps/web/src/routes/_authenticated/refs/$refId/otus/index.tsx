import OtuList from "@otus/components/OtuList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const otuListSearchSchema = z.object({
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/")({
	validateSearch: otuListSearchSchema,
	component: OtusRoute,
});

function OtusRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<OtuList
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
