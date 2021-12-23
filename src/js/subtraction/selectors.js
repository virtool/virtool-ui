import { get, filter } from "lodash-es";
import { createSelector } from "reselect";

export const getSubtractionShortlist = state => get(state, "subtraction.shortlist");

export const getReadySubtractionShortlist = createSelector(getSubtractionShortlist, subtractions =>
    filter(subtractions, { ready: true })
);
