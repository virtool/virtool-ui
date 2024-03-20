import { Accordion } from "@base/accordion/Accordion";
import { createFuse } from "@utils/utils";
import { map, sortBy } from "lodash-es";
import { reject } from "lodash-es/lodash";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PathoscopeItem } from "./PathoscopeItem";

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

/** A list of pathoscope hits*/
export const PathoscopeList = ({ detail, sample }) => {
    return (
        <Accordion type="single" collapsible>
            {map(useSortAndFilterPathoscopeHits(detail, sample.quality.length[1]), match => (
                <PathoscopeItem key={match.id} match={match} mappedCount={detail.results.readCount} />
            ))}
        </Accordion>
    );
};
