import { createSelector } from "reselect";

export const getTermSelectorFactory = selector => {
    return createSelector([selector], term => {
        const url = new URL(window.location);
        console.log("factory", url.searchParams.get("find"));
        return url.searchParams.get("find") || term;
    });
};
