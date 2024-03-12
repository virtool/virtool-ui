import { Accordion } from "@base/accordion/Accordion";
import { getMaxReadLength } from "@samples/selectors";
import { createFuse } from "@utils/utils";
import { map, sortBy } from "lodash-es";
import { reject } from "lodash-es/lodash";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { setActiveHitId } from "../../actions";
import { getMatches } from "../../selectors";
import PathoscopeItem from "./PathoscopeItem";

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
export const PathoscopeList = ({ matches, maxReadLength, detail }) => {
    return (
        <Accordion type="single" collapsible>
            {map(useSortAndFilterPathoscopeHits(detail, maxReadLength), match => (
                <PathoscopeItem key={match.id} match={match} />
            ))}
        </Accordion>
    );
};

export function mapStateToProps(state) {
    const matches = getMatches(state);

    return {
        matches,
        maxReadLength: getMaxReadLength(state),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onSetActiveId: index => {
            dispatch(setActiveHitId(index));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PathoscopeList);
