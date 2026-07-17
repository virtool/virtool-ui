import { type Paginated, paginated } from "@app/pagination";
import { numberArray, str, stringArray } from "@app/searchParams";
import SamplesList from "@samples/components/SamplesList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for the samples list. */
type SamplesSearch = Paginated & {
	term: string;
	labels: number[];
	users: number[];
	workflows: string[];
};

function validateSamplesSearch(
	input: Partial<SamplesSearch> & SearchSchemaInput,
): SamplesSearch {
	return {
		...paginated(input),
		term: str(input.term, ""),
		labels: numberArray(input.labels, []),
		users: numberArray(input.users, []),
		workflows: stringArray(input.workflows, []),
	};
}

export const Route = createFileRoute("/_authenticated/samples/")({
	validateSearch: validateSamplesSearch,
	component: SamplesRoute,
});

function SamplesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SamplesList
			filterLabels={search.labels}
			page={search.page}
			term={search.term}
			users={search.users}
			workflows={search.workflows}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
