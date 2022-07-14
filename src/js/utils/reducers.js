import { includes, map, reject, sortBy, unionBy } from "lodash-es";

export const updateDocuments = (state, payload, sortKey, sortReverse) => {
    const existing = payload.page === 1 ? [] : state.documents || [];

    const documents = sortBy(unionBy(payload.documents, existing, "id"), sortKey);

    if (sortReverse) {
        documents.reverse();
    }

    return {
        ...state,
        ...payload,
        documents
    };
};

export const updateModeledDocuments = (state, payload, model, sortKey, sortReverse) => {
    const existing = payload.page === 1 ? [] : state.documents || [];

    const documents = sortBy(unionBy(payload.documents, existing, "id"), sortKey);

    if (sortReverse) {
        documents.reverse();
    }

    return { ...state, ...payload, documents: map(documents, document => new model(document)) };
};

export const insert = (state, payload, sortKey, sortReverse = false) => {
    const documents = sortBy(unionBy(state.documents || [], [payload], "id"), sortKey);
    if (sortReverse) {
        documents.reverse();
    }

    return {
        ...state,
        documents
    };
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
        documents
    };
};

export const remove = (state, payload) => {
    if (!state.documents) {
        return state;
    }

    return {
        ...state,
        documents: reject(state.documents, ({ id }) => includes(payload, id))
    };
};

export const updateMember = (list, payload) => {
    if (!list) {
        return list;
    }
    return map(list, item => {
        if (item.id === payload.id) {
            return payload;
        }
        return item;
    });
};
