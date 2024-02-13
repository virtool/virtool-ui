import { createReducer } from "@reduxjs/toolkit";
import { find, hasIn, map } from "lodash-es";
import {
    ADD_SEQUENCE,
    CREATE_OTU,
    EDIT_OTU,
    EDIT_SEQUENCE,
    FIND_OTUS,
    GET_OTU,
    GET_OTU_HISTORY,
    HIDE_OTU_MODAL,
    REFRESH_OTUS,
    REMOVE_ISOLATE,
    REMOVE_OTU,
    REMOVE_SEQUENCE,
    REVERT,
    SELECT_ISOLATE,
    SET_ISOLATE_AS_DEFAULT,
    SHOW_EDIT_OTU,
    SHOW_REMOVE_ISOLATE,
    SHOW_REMOVE_OTU,
    SHOW_REMOVE_SEQUENCE,
    UPLOAD_IMPORT,
    WS_INSERT_OTU,
    WS_REMOVE_OTU,
    WS_UPDATE_OTU,
    WS_UPDATE_STATUS,
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";
import { formatIsolateName } from "../utils/utils";

export const initialState = {
    term: "",
    refId: "",
    documents: null,
    detail: null,
    page: 0,
    detailHistory: null,
    edit: false,
    remove: false,
    removeIsolate: false,
    removeSequence: false,
    activeIsolateId: null,
    importData: null,
    verified: false,
};

export const hideOTUModal = state => ({
    ...state,
    edit: false,
    remove: false,
    removeIsolate: false,
    removeSequence: false,
});

export const getActiveIsolate = state => {
    const isolates = state.detail.isolates;

    if (isolates.length) {
        const activeIsolate = find(isolates, { id: state.activeIsolateId }) || isolates[0];

        return {
            ...state,
            activeIsolate,
            activeIsolateId: activeIsolate.id,
        };
    }

    return {
        ...state,
        activeIsolate: null,
        activeIsolateId: null,
    };
};

export const receiveOTU = (state, action) => {
    const detail = {
        ...action,
        isolates: map(action.isolates, isolate => ({
            ...isolate,
            name: formatIsolateName(isolate),
        })),
    };

    return getActiveIsolate({ ...state, detail });
};

export const OTUsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_UPDATE_STATUS, (state, action) => {
            if (action.payload.id === "OTU_import") {
                state.importData = { ...action.payload, inProgress: true };
            }
        })
        .addCase(WS_INSERT_OTU, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return insert(state, action.payload, "name");
            }

            return state;
        })
        .addCase(WS_UPDATE_OTU, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return update(state, action.payload, "name");
            }
            return state;
        })
        .addCase(WS_REMOVE_OTU, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(FIND_OTUS.REQUESTED, (state, action) => {
            if (action.payload.refId !== state.refId) {
                state.documents = null;
            }
            state.term = action.payload.term;
            state.verified = action.payload.verified;
            state.refId = action.payload.refId;
        })
        .addCase(FIND_OTUS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "name");
        })
        .addCase(REFRESH_OTUS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "name");
        })
        .addCase(GET_OTU.REQUESTED, state => {
            return hideOTUModal({ ...state, detail: null, activeIsolateId: null });
        })
        .addCase(REMOVE_OTU.SUCCEEDED, state => {
            return hideOTUModal({ ...state, detail: null, activeIsolateId: null });
        })
        .addCase(GET_OTU_HISTORY.REQUESTED, (state, action) => {
            state.detailHistory = null;
        })
        .addCase(GET_OTU_HISTORY.SUCCEEDED, (state, action) => {
            state.detailHistory = action.payload;
        })
        .addCase(REVERT.SUCCEEDED, (state, action) => {
            return { ...receiveOTU(state, action.payload.otu), detailHistory: action.payload.history };
        })
        .addCase(UPLOAD_IMPORT.SUCCEEDED, (state, action) => {
            state.importData = { ...action.payload, inProgress: false };
        })
        .addCase(SELECT_ISOLATE, (state, action) => {
            state.activeIsolate = find(state.detail.isolates, { id: action.payload.isolateId });
            state.activeIsolateId = action.payload.isolateId;
        })
        .addCase(SHOW_EDIT_OTU, state => {
            state.edit = true;
        })
        .addCase(SHOW_REMOVE_OTU, state => {
            state.remove = true;
        })
        .addCase(SHOW_REMOVE_ISOLATE, state => {
            state.removeIsolate = true;
        })
        .addCase(SHOW_REMOVE_SEQUENCE, (state, action) => {
            state.removeSequence = action.payload.sequenceId;
        })
        .addCase(HIDE_OTU_MODAL, state => {
            state.edit = false;
            state.remove = false;
            state.removeIsolate = false;
            state.removeSequence = false;
        })
        .addCase(CREATE_OTU.SUCCEEDED, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return insert(state, action.payload, "name");
            }
        })
        .addMatcher(
            action => {
                const matches = {
                    [GET_OTU.SUCCEEDED]: true,
                    [EDIT_OTU.SUCCEEDED]: true,
                    [ADD_SEQUENCE.SUCCEEDED]: true,
                    [EDIT_SEQUENCE.SUCCEEDED]: true,
                    [REMOVE_SEQUENCE.SUCCEEDED]: true,
                    [SET_ISOLATE_AS_DEFAULT.SUCCEEDED]: true,
                    [REMOVE_ISOLATE.SUCCEEDED]: true,
                };
                return hasIn(matches, action.type);
            },
            (state, action) => {
                return hideOTUModal(receiveOTU(state, action.payload));
            },
        );
});

export default OTUsReducer;
