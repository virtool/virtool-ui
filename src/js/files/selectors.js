import { keyBy, map } from "lodash-es";
import { createSelector } from "reselect";

const getFiles = state => state.files.items;

export const getFilesById = createSelector(getFiles, files => keyBy(files, "id"));

export const getFilteredFileIds = createSelector(getFiles, documents => {
    if (documents) {
        return map(documents, document => document.id);
    }

    return null;
});
