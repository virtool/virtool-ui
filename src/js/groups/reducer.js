import { createReducer } from "@reduxjs/toolkit";
import { concat, sortBy, unionBy } from "lodash-es";
import {
    CHANGE_ACTIVE_GROUP,
    CREATE_GROUP,
    GET_GROUP,
    LIST_GROUPS,
    SET_GROUP_PERMISSION,
    WS_INSERT_GROUP,
    WS_REMOVE_GROUP,
    WS_UPDATE_GROUP
} from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

export const initialState = {
    documents: null,
    activeGroup: null
};

export const updateGroup = (state, updateVal) => ({
    ...state,
    documents: sortBy(unionBy([updateVal], state.documents, "id"), "id")
});

export const insertGroup = (documents, entry) => sortBy(concat(documents, [entry]), "id");

export const groupsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_GROUP, (state, action) => {
            return insert(state, action.payload, "id");
        })
        .addCase(WS_UPDATE_GROUP, (state, action) => {
            return update(state, action.payload);
        })
        .addCase(WS_REMOVE_GROUP, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(CHANGE_ACTIVE_GROUP, (state, action) => {
            state.activeId = action.payload.id;
        })
        .addCase(LIST_GROUPS.SUCCEEDED, (state, action) => {
            return { ...state, documents: action.payload };
        })
        .addCase(GET_GROUP.SUCCEEDED, (state, action) => {
            state.activeGroup = action.payload;
        })
        .addCase(SET_GROUP_PERMISSION.SUCCEEDED, (state, action) => {
            state.activeGroup = action.payload;
        });
});

export default groupsReducer;
