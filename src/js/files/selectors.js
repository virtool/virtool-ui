import { keyBy, map } from "lodash-es";
import { createSelector } from "reselect";

export const getFiles = state => state.files.items;

export const getFilesById = createSelector(getFiles, files => keyBy(files, "id"));

export const getFilteredFileIds = createSelector(getFiles, files => {
    if (files) {
        return map(files, file => file.id);
    }

    return null;
});
