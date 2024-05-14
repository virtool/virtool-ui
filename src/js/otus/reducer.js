import { ADD_SEQUENCE, EDIT_SEQUENCE, GET_OTU, WS_UPDATE_OTU } from "@app/actionTypes";
import { createReducer } from "@reduxjs/toolkit";
import { update } from "@utils/reducers";
import { formatIsolateName } from "@utils/utils";
import { find, hasIn, map } from "lodash-es";

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
        .addCase(WS_UPDATE_OTU, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return update(state, action.payload, "name");
            }
            return state;
        })
        .addCase(GET_OTU.REQUESTED, state => {
            return hideOTUModal({ ...state, detail: null, activeIsolateId: null });
        })
        .addMatcher(
            action => {
                const matches = {
                    [GET_OTU.SUCCEEDED]: true,
                    [ADD_SEQUENCE.SUCCEEDED]: true,
                    [EDIT_SEQUENCE.SUCCEEDED]: true,
                };
                return hasIn(matches, action.type);
            },
            (state, action) => {
                return hideOTUModal(receiveOTU(state, action.payload));
            },
        );
});

export default OTUsReducer;
