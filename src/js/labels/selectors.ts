import { find } from "lodash-es";

export const getLabels = state => state.labels.documents;

export const getLabelById = (state, id: number) => {
    return find(getLabels(state), { id });
};
