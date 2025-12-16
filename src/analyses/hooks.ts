import { createFuse } from "@app/fuse";
import { useUrlSearchParam } from "@app/hooks";
import { useListIndexes } from "@indexes/queries";
import { IndexMinimal } from "@indexes/types";
import { useFetchSample } from "@samples/queries";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { SubtractionOption } from "@subtraction/types";
import { groupBy, maxBy, sortBy } from "es-toolkit";
import { useMemo } from "react";
import { useSearch } from "wouter";
import { FormattedNuvsAnalysis, FormattedPathoscopeAnalysis } from "./types";

/** Sort and filter a list of pathoscope hits  */
export function useSortAndFilterPathoscopeHits(
    detail: FormattedPathoscopeAnalysis,
    maxReadLength: number,
) {
    let hits = detail.results.hits;
    const search = useSearch();
    const searchParams = new URLSearchParams(search);

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "abbreviation"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = fuse
            .search(searchParams.get("find"))
            .map((result) => result.item);
    }

    if (searchParams.get("filterOtus") === "true") {
        hits = hits.filter(
            (hit) =>
                hit.pi * detail.results.readCount >=
                (hit.length * 0.8) / maxReadLength,
        );
    }

    const sortKey = searchParams.get("sort");
    const sortedHits = sortBy(hits, [(hit) => hit[sortKey]]);

    if (searchParams.get("sortDesc") === "true") {
        sortedHits.reverse();
    }

    return sortedHits;
}

/** Sort and filter a list of Nuvs hits  */
export function useSortAndFilterNuVsHits(detail: FormattedNuvsAnalysis) {
    const search = useSearch();
    const searchParams = new URLSearchParams(search);

    let hits = detail.results.hits;

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "families"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = fuse
            .search(searchParams.get("find"))
            .map((result) => result.item);
    }

    if (searchParams.get("filterSequences") === "true") {
        hits = hits.filter((hit) => hit.e !== undefined);
    }

    const sortedHits =
        searchParams.get("sort") === "orfs"
            ? sortBy(hits, [(hit) => hit.annotatedOrfCount]).reverse()
            : sortBy(hits, [(hit) => hit[searchParams.get("sort")]]);

    return sortedHits;
}

export function useGetActiveHit(matches) {
    const { value: activeHit } = useUrlSearchParam<string>("activeHit");

    if (activeHit !== null) {
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

    const { data: sample, isPending: isPendingSample } =
        useFetchSample(sampleId);

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
