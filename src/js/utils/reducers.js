import { forEach, includes, map, reject, sortBy, unionBy } from "lodash-es";

export const updateDocuments = (state, payload, sortKey, sortReverse) => {
    const existing = payload.page === 1 ? [] : state.documents || [];

    const documents = sortBy(unionBy(payload.documents, existing, "id"), sortKey);

    if (sortReverse) {
        documents.reverse();
    }

    return {
        ...state,
        ...payload,
        documents,
    };
};

export const insert = (state, payload, sortKey, sortReverse = false) => {
    const documents = sortBy(unionBy(state.documents || [], [payload], "id"), sortKey);
    if (sortReverse) {
        documents.reverse();
    }

    return {
        ...state,
        documents,
    };
};

export const updateMember = (list, payload) => {
    if (list) {
        return map(list, item => {
            if (item.id === payload.id) {
                return payload;
            }
            return item;
        });
    }

    return list;
};

export const update = (state, payload, sortKey, sortReverse = false) => {
    if (!state.documents) {
        return state;
    }

    const documents = sortBy(updateMember(state.documents, payload), sortKey);

    if (sortReverse) {
        documents.reverse();
    }

    return {
        ...state,
        documents,
    };
};

export const remove = (state, payload) => {
    if (!state.documents) {
        return state;
    }

    return {
        ...state,
        documents: reject(state.documents, ({ id }) => includes(payload, id)),
    };
};

/**
 * Update the job fields of documents in state with matching job ids.
 *
 * @param state {object} the current reducer state
 * @param payload {object} the job data to update
 * @returns {object} the updated reducer state
 */
export function updateJobs(state, payload) {
    if (!state.documents) {
        return state;
    }

    forEach(state.documents, document => {
        if (document.job.id === payload.id) {
            document.job = {
                ...document.job,
                ...payload,
            };
        }
    });
}
