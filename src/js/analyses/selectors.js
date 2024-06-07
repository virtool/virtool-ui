import { filter, find, intersection, keyBy, map, reject, sortBy, toNumber, toString } from "lodash-es";
import { createSelector } from "reselect";
import { getMaxReadLength } from "../samples/selectors";
import { createFuse } from "../utils/utils";
import { fuseSearchKeys } from "./utils";

export const getActiveId = state => state.analyses.activeId;
export const getFilterOTUs = state => state.analyses.filterOTUs;
export const getFilterSequences = state => state.analyses.filterSequences;
export const getFilterAODP = state => state.analyses.filterAODP;
export const getHits = state => state.analyses.detail.results.hits;
export const getReadCount = state => state.analyses.detail.results.readCount;
export const getResults = state => state.analyses.detail.results;
export const getWorkflow = state => state.analyses.detail.workflow;

/**
 * Return a Fuse object for searching through results given an workflow name. The workflow will determine which keys the
 * search runs over.
 *
 */
export const getFuse = createSelector([getWorkflow, getHits], (workflow, hits) =>
    createFuse(hits, fuseSearchKeys[workflow], "id"),
);

export const getFilterIds = createSelector(
    [getFilterAODP, getWorkflow, getHits, getFilterOTUs, getFilterSequences, getMaxReadLength, getReadCount],
    (aodpFilter, workflow, hits, filterOTUs, filterSequences, maxReadLength, readCount) => {
        if (workflow === "nuvs") {
            const filteredHits = filterSequences ? reject(hits, { e: undefined }) : hits;
            return map(filteredHits, "id");
        }

        if (workflow === "pathoscope_bowtie" && filterOTUs) {
            const filteredHits = reject(hits, hit => {
                return hit.pi * readCount < (hit.length * 0.8) / maxReadLength;
            });

            return map(filteredHits, "id");
        }

        if (workflow === "aodp" && aodpFilter) {
            const filteredHits = filter(hits, hit => {
                if (hit.identity > aodpFilter * 100) {
                    return hit.id;
                }
            });

            return map(filteredHits, fi => fi.id);
        }

        return map(hits, "id");
    },
);

export const getSearchIds = state => state.analyses.searchIds;

export const getSortKey = state => state.analyses.sortKey;

export const getSortIds = createSelector([getWorkflow, getHits, getSortKey], (workflow, hits, sortKey) => {
    switch (sortKey) {
        case "e":
            return map(sortBy(hits, "e"), "id");

        case "orfs":
            return map(sortBy(hits, "annotatedOrfCount").reverse(), "id");

        case "length":
            return map(sortBy(hits, "sequence.length").reverse(), "id");

        case "depth":
            return map(sortBy(hits, "depth").reverse(), "id");

        case "coverage":
            return map(sortBy(hits, "coverage").reverse(), "id");

        case "weight":
            return map(sortBy(hits, "pi").reverse(), "id");

        case "identity":
            return map(sortBy(hits, "identity").reverse(), "id");

        default:
            return map(hits, "id");
    }
});

export const getMatches = createSelector(
    [getWorkflow, getHits, getFilterIds, getSearchIds, getSortIds],
    (workflow, hits, filterIds, searchIds, sortIds) => {
        const matchIds = searchIds
            ? intersection(sortIds, filterIds, map(searchIds, workflow === "nuvs" ? toNumber : toString))
            : intersection(sortIds, filterIds);

        const keyed = keyBy(hits, "id");

        return map(matchIds, id => keyed[id]);
    },
);

export const getActiveHit = createSelector([getWorkflow, getMatches, getActiveId], (workflow, matches, activeId) => {
    if (activeId !== null) {
        const hit = find(matches, { id: activeId });

        if (hit) {
            return hit;
        }
    }

    return matches[0] || null;
});
