import { get, mapValues, reduce } from "lodash-es";
import { createSelector } from "reselect";

export const getJobDetailId = state => get(state, "jobs.detail.id");
export const getLinkedJobs = state => state.jobs.linkedJobs;
export const getJobCounts = state => state.jobs.counts;

export const getJobCountsByState = createSelector(getJobCounts, counts =>
    mapValues(counts, workflowCounts => reduce(workflowCounts, (result, value) => (result += value), 0)),
);

export const getJobCountsTotal = createSelector(getJobCountsByState, countsByState =>
    reduce(countsByState, (result, value) => (result += value), 0),
);

export const getStatesFromURL = state => {
    const params = new URLSearchParams(state.router.location.search);
    return params.getAll("state") || [];
};
