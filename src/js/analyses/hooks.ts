import { createFuse } from "@utils/utils";
import { map, reject, sortBy } from "lodash-es/lodash";
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
