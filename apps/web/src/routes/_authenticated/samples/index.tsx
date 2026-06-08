import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchLabels } from "@labels/queries";
import SamplesList from "@samples/components/SamplesList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const samplesSearchSchema = z.object({
	term: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
	labels: z.array(z.number()).default([]).catch([]),
	workflows: z.array(z.string()).default([]).catch([]),
});

export const Route = createFileRoute("/_authenticated/samples/")({
	validateSearch: samplesSearchSchema,
	component: SamplesRoute,
});

function SamplesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: labels, isPending } = useFetchLabels();

	if (isPending || !labels) {
		return <LoadingPlaceholder />;
	}

	return (
		<SamplesList
			filterLabels={search.labels}
			labels={labels}
			page={search.page}
			term={search.term}
			workflows={search.workflows}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
