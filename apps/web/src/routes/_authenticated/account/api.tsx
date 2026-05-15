import ApiKeys from "@account/components/ApiKeys";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const apiSearchSchema = z.object({
	openCreateKey: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/account/api")({
	validateSearch: apiSearchSchema,
	component: ApiKeysRoute,
});

function ApiKeysRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ApiKeys
			openCreateKey={Boolean(search.openCreateKey)}
			setOpenCreateKey={(openCreateKey) =>
				navigate({ search: { ...search, openCreateKey } })
			}
		/>
	);
}
