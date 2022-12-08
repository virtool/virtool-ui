import { createReducer } from "@reduxjs/toolkit";
import { concat, map, sortBy, unionBy } from "lodash-es";
import {
    REMOVE_ACTIVE_GROUP,
    GET_GROUP,
    LIST_GROUPS,
    SET_GROUP_PERMISSION,
    WS_INSERT_GROUP,
    WS_REMOVE_GROUP,
    WS_UPDATE_GROUP,
    SET_GROUP_NAME
} from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

export const initialState = {
    documents: null,
    activeGroup: null
};

export const updateGroup = (state, updateVal) => ({
    ...state,
    documents: sortBy(unionBy([updateVal], state.documents, "id"), "name")
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
        .addCase(REMOVE_ACTIVE_GROUP, state => {
            state.activeGroup = null;
        })
        .addCase(LIST_GROUPS.SUCCEEDED, (state, action) => {
            state.documents = action.payload;
        })
        .addCase(GET_GROUP.SUCCEEDED, (state, action) => {
            state.activeGroup = action.payload;
        })
        .addCase(SET_GROUP_PERMISSION.SUCCEEDED, (state, action) => {
            state.activeGroup = action.payload;
        })
        .addCase(SET_GROUP_NAME.SUCCEEDED, (state, action) => {
            const name = action.payload.name;

            return {
                ...state,
                activeGroup: { ...state.activeGroup, name },
                documents: map(state.documents, document => {
                    if (document.id === action.payload.id) {
                        return { ...document, name };
                    }

                    return document;
                })
            };
        });
});

export default groupsReducer;
