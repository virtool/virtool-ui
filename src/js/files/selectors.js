import { keyBy, map, reject, sortBy } from "lodash-es";
import { createSelector } from "reselect";

const getFiles = state => state.files.documents;

export const getFilesById = createSelector(getFiles, files => keyBy(files, "id"));

export const getFilteredFileIds = createSelector(getFiles, documents => {
    if (documents) {
        return map(
            sortBy(
                reject(documents, document => document.reserved || !document.ready),
                "uploaded_at"
            ).reverse(),
            "id"
        );
    }

    return null;
});
