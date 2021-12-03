import { createReducer } from "@reduxjs/toolkit";
import { concat, get, hasIn, some, sortBy, unionBy } from "lodash-es";
import {
    CHANGE_ACTIVE_GROUP,
    CREATE_GROUP,
    LIST_GROUPS,
    REMOVE_GROUP,
    SET_GROUP_PERMISSION,
    WS_INSERT_GROUP,
    WS_REMOVE_GROUP,
    WS_UPDATE_GROUP
} from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

export const updateActiveId = state => {
    if (state.activeId && some(state.documents, { id: state.activeId })) {
        return state;
    }

    return {
        ...state,
        activeId: get(state, "documents[0].id", "")
    };
};

export const initialState = {
    documents: null,
    pending: false,
    activeId: ""
};

export const updateGroup = (state, updateVal) => ({
    ...state,
    pending: false,
    documents: sortBy(unionBy([updateVal], state.documents, "id"), "id")
});

export const insertGroup = (documents, entry) => sortBy(concat(documents, [entry]), "id");

export const groupsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_GROUP, (state, action) => {
            return insert(state, action, "id");
        })
        .addCase(WS_UPDATE_GROUP, (state, action) => {
            return update(state, action);
        })
        .addCase(WS_REMOVE_GROUP, (state, action) => {
            return updateActiveId(remove(state, action));
        })
        .addCase(CHANGE_ACTIVE_GROUP, (state, action) => {
            state.activeId = action.id;
        })
        .addCase(LIST_GROUPS.SUCCEEDED, (state, action) => {
            return updateActiveId({ ...state, documents: action.data });
        })
        .addCase(CREATE_GROUP.SUCCEEDED, (state, action) => {
            state.pending = false;
            state.activeId = action.data.id;
        })
        .addCase(REMOVE_GROUP.SUCCEEDED, state => {
            return updateActiveId({ ...state, pending: false });
        })
        .addCase(SET_GROUP_PERMISSION.SUCCEEDED, state => {
            state.pending = false;
        })
        .addCase(CREATE_GROUP.FAILED, (state, action) => {
            if (action.message === "Group already exists") {
                state.createError = true;
                state.pending = false;
            }
        })
        .addMatcher(
            action => {
                const matches = {
                    [CREATE_GROUP.REQUESTED]: true,
                    [REMOVE_GROUP.REQUESTED]: true,
                    [SET_GROUP_PERMISSION.REQUESTED]: true
                };
                return hasIn(matches, action.type);
            },
            state => {
                state.pending = true;
            }
        );
});

export default groupsReducer;
