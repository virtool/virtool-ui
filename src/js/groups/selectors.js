import { createSelector } from "reselect";

export const getGroups = state => state.groups.documents;
export const getUsers = state => state.users.documents;
export const getActiveId = state => state.groups.activeId;

export const getLoading = createSelector(
    state => state.groups.documents,
    state => state.users.documents,
    (groups, users) => {
        return !groups | !users;
    }
);
