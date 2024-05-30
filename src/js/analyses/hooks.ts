import { useLocationState } from "@utils/hooks";
import { createFuse } from "@utils/utils";
import { find, map, reject, sortBy } from "lodash-es/lodash";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/** Sort and filter a list of pathoscope hits  */
export function useSortAndFilterPathoscopeHits(detail, maxReadLength) {
    let hits = detail.results.hits;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "abbreviation"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = map(fuse.search(searchParams.get("find")), "item");
    }

    if (searchParams.get("filterOtus")) {
        hits = reject(hits, hit => {
            return hit.pi * detail.results.readCount < (hit.length * 0.8) / maxReadLength;
        });
    }

    const sortedHits = sortBy(hits, searchParams.get("sort"));

    if (searchParams.get("sortDesc")) {
        sortedHits.reverse();
    }

    return sortedHits;
}

/** Sort and filter a list of NuVs hits  */
export function useSortAndFilterNuVsHits(detail) {
    let hits = detail.results.hits;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fuse = useMemo(() => {
        return createFuse(hits, ["name", "families"]);
    }, [hits]);

    if (searchParams.get("find")) {
        hits = map(fuse.search(searchParams.get("find")), "item");
    }

    if (searchParams.get("filterSequences")) {
        hits = reject(hits, hit => hit.e === undefined);
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
    const [locationState, setLocationState] = useLocationState();
    const activeId = locationState?.activeHitId;

    if (activeId !== null) {
        const hit = find(matches, { id: activeId });

        if (hit) {
            return hit;
        }
    }

    setLocationState({ activeHitId: matches[0].id });
    return matches[0] || null;
}
