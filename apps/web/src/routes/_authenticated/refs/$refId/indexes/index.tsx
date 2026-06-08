import Indexes from "@indexes/components/Indexes";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod/v4";

declare module "@tanstack/react-router" {
	interface HistoryState {
		openRebuild?: boolean;
	}
}

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
	const initialOpenRebuild = useLocation({
		select: (location) => Boolean(location.state.openRebuild),
	});
	const [openRebuild, setOpenRebuild] = useState(initialOpenRebuild);

	// Discard the deep-link intent so a refresh doesn't reopen the dialog.
	useEffect(() => {
		if (initialOpenRebuild) {
			navigate({
				replace: true,
				state: (prev) => ({ ...prev, openRebuild: undefined }),
			});
		}
	}, [initialOpenRebuild, navigate]);

	return (
		<Indexes
			openRebuild={openRebuild}
			page={search.page}
			setOpenRebuild={setOpenRebuild}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
