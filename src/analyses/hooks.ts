import { createFuse } from "@app/fuse";
import { useUrlSearchParam } from "@app/hooks";
import { useListIndexes } from "@indexes/queries";
import { IndexMinimal } from "@indexes/types";
import { useFetchSample } from "@samples/queries";
import { useFetchSubtractionsShortlist } from "@subtraction/queries";
import { SubtractionOption } from "@subtraction/types";
import { find, groupBy, map, maxBy, reject, sortBy } from "lodash-es/lodash";
import { useMemo } from "react";
import { useSearch } from "wouter";

/** Sort and filter a list of pathoscope hits  */
export function useSortAndFilterPathoscopeHits(detail, maxReadLength) {
    let hits = detail.results.hits;
    const search = useSearch();
    const searchParams = new URLSearchParams(search);

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "abbreviation"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = map(fuse.search(searchParams.get("find")), "item");
    }

    if (searchParams.get("filterOtus") === "true") {
        hits = reject(hits, (hit) => {
            return (
                hit.pi * detail.results.readCount <
                (hit.length * 0.8) / maxReadLength
            );
        });
    }

    const sortedHits = sortBy(hits, searchParams.get("sort"));

    if (searchParams.get("sortDesc") === "true") {
        sortedHits.reverse();
    }

    return sortedHits;
}

/** Sort and filter a list of Nuvs hits  */
export function useSortAndFilterNuVsHits(detail) {
    let hits = detail.results.hits;
    const search = useSearch();
    const searchParams = new URLSearchParams(search);

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "families"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = map(fuse.search(searchParams.get("find")), "item");
    }

    if (searchParams.get("filterSequences") === "true") {
        hits = reject(hits, (hit) => hit.e === undefined);
    }

    let sortedHits;

    if (searchParams.get("sort") === "orfs") {
        sortedHits = sortBy(hits, "annotatedOrfCount").reverse();
    } else {
        sortedHits = sortBy(hits, searchParams.get("sort"));
    }

    return sortedHits;
}

export function useGetActiveHit(matches) {
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");

    if (activeHit !== null) {
        const hit = find(matches, { id: Number(activeHit) });

        if (hit) {
            return hit;
        }
    }

    setActiveHit(matches[0].id);
    return matches[0] || null;
}

type UseCompatibleIndexesResult = {
    indexes: IndexMinimal[];
    isPending: boolean;
};

export function useCompatibleIndexes(): UseCompatibleIndexesResult {
    const { data, isPending } = useListIndexes(true);

    const indexes = map(groupBy(data, "reference.id"), (group) =>
        maxBy(group, "version"),
    );

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
