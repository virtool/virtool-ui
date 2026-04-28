import { useAnalysisSearch } from "@analyses/components/AnalysisSearchContext";
import { createFuse } from "@app/fuse";
import { useListIndexes } from "@indexes/queries";
import type { IndexMinimal } from "@indexes/types";
import { useFetchSample } from "@samples/queries";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import type { SubtractionOption } from "@subtraction/types";
import { groupBy, maxBy, sortBy } from "es-toolkit";
import type {
	FormattedNuvsAnalysis,
	FormattedPathoscopeAnalysis,
} from "./types";

/** Sort and filter a list of pathoscope hits  */
export function useSortAndFilterPathoscopeHits(
	detail: FormattedPathoscopeAnalysis,
	maxReadLength: number,
) {
	let hits = detail.results.hits;

	const {
		search: { find, filterOtus, sort, sortDesc },
	} = useAnalysisSearch();

	const fuse = createFuse(hits, ["name", "abbreviation"]);

	if (find) {
		hits = fuse.search(String(find)).map((result) => result.item);
	}

	if (filterOtus) {
		hits = hits.filter(
			(hit) =>
				hit.pi * detail.results.readCount >= (hit.length * 0.8) / maxReadLength,
		);
	}

	const sortedHits = sortBy(hits, [(hit) => hit[sort as string]]);

	if (sortDesc) {
		sortedHits.reverse();
	}

	return sortedHits;
}

/** Sort and filter a list of Nuvs hits  */
export function useSortAndFilterNuVsHits(detail: FormattedNuvsAnalysis) {
	let hits = detail.results.hits;

	const {
		search: { find, filterSequences, sort },
	} = useAnalysisSearch();

	const fuse = createFuse(hits, ["name", "families"]);

	if (find) {
		hits = fuse.search(String(find)).map((result) => result.item);
	}

	if (filterSequences) {
		hits = hits.filter((hit) => hit.e !== undefined);
	}

	const sortedHits =
		sort === "orfs"
			? sortBy(hits, [(hit) => hit.annotatedOrfCount]).reverse()
			: sortBy(hits, [(hit) => hit[sort as string]]);

	return sortedHits;
}

export function useGetActiveHit(matches) {
	const {
		search: { activeHit },
	} = useAnalysisSearch();

	if (activeHit) {
		return matches.find((match) => match.id === Number(activeHit)) || null;
	}

	return null;
}

type UseCompatibleIndexesResult = {
	indexes: IndexMinimal[];
	isPending: boolean;
};

export function useCompatibleIndexes(): UseCompatibleIndexesResult {
	const { data, isPending } = useListIndexes(true);

	const indexes = Object.values(
		groupBy(data ?? [], (item) => item.reference.id),
	)
		.map((group) => maxBy(group, (item) => Number(item.version)))
		.filter((index): index is IndexMinimal => index !== undefined);

	return { indexes, isPending };
}

type UseSubtractionOptionsResult = {
	defaultSubtractions: SubtractionOption[];
	subtractions: SubtractionOption[];
	isPending: boolean;
};

/**
 * Get the available subtraction options for a list of sample ids.
 *
 * Subtractions that are not ready are filtered out.
 *
 * If more than one sample id is passed, the default subtractions list will be
 * empty. Default subtractions aggregated for multiple samples are confusing and
 * costly to request.
 *
 * @param sampleIds
 */
export function useSubtractionOptions(
	sampleIds: string[],
): UseSubtractionOptionsResult {
	const {
		data: subtractionShortlist,
		isPending: isPendingSubtractionShortlist,
	} = useFetchSubtractionsShortlist(true);

	const sampleId = sampleIds[0];

	const { data: sample, isPending: isPendingSample } = useFetchSample(sampleId);

	if (isPendingSample || isPendingSubtractionShortlist) {
		return {
			defaultSubtractions: [],
			subtractions: [],
			isPending: true,
		};
	}

	const defaultSubtractionIds =
		sampleIds.length === 1
			? sample.subtractions.map((subtraction) => subtraction.id)
			: [];

	const subtractions = subtractionShortlist
		.map((subtraction) => {
			return {
				...subtraction,
				isDefault: defaultSubtractionIds.includes(subtraction.id),
			};
		})
		.filter((subtraction) => subtraction.ready);

	const defaultSubtractions = subtractions.filter(
		(subtraction) => subtraction.isDefault,
	);

	return {
		defaultSubtractions,
		subtractions,
		isPending: false,
	};
}
