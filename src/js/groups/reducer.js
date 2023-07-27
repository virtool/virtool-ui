import { createReducer } from "@reduxjs/toolkit";
import { concat, sortBy, unionBy } from "lodash-es";
import { LIST_GROUPS, WS_INSERT_GROUP, WS_REMOVE_GROUP, WS_UPDATE_GROUP } from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

export const initialState = {
    documents: null,
    activeGroup: null,
};

export const updateGroup = (state, updateVal) => ({
    ...state,
    documents: sortBy(unionBy([updateVal], state.documents, "id"), "name"),
});

export const insertGroup = (documents, entry) => sortBy(concat(documents, [entry]), "name");

export const groupsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_GROUP, (state, action) => {
            return insert(state, action.payload, "name");
        })
        .addCase(WS_UPDATE_GROUP, (state, action) => {
            return update(state, action.payload);
        })
        .addCase(WS_REMOVE_GROUP, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(LIST_GROUPS.SUCCEEDED, (state, action) => {
            state.documents = action.payload;
        });
});

export default groupsReducer;
