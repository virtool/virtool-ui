import { useUrlSearchParam } from "@utils/hooks";
import { createFuse } from "@utils/utils";
import { find, map, reject, sortBy } from "lodash-es/lodash";
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

/** Sort and filter a list of NuVs hits  */
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
