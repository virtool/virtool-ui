import { filter, forEach, intersectionWith, mapValues, reduce } from "lodash-es";
import { createSelector } from "reselect";

export const getSampleDocuments = state => state.samples.documents;
export const getSelectedSampleIds = state => state.samples.selected;

export const getMaxReadLength = state => state.samples.detail.quality.length[1];

export const getSelectedSamples = createSelector([getSelectedSampleIds, getSampleDocuments], (selected, documents) =>
    intersectionWith(documents, selected, (document, selectedSample) => document.id === selectedSample),
);

export const getSelectedLabels = createSelector([getSelectedSamples], selectedSamples => {
    const selectedLabelsCount = reduce(
        selectedSamples,
        (result, sample) => {
            forEach(sample.labels, label => {
                if (result[label.id]) {
                    result[label.id].count++;
                } else {
                    result[label.id] = { ...label, count: 1 };
                }
            });
            return result;
        },
        {},
    );

    return mapValues(selectedLabelsCount, label => {
        label.allLabeled = label.count === selectedSamples.length;
        delete label.count;
        return label;
    });
});

export const getPartiallySelectedLabels = createSelector([getSelectedLabels], selectedLabels =>
    filter(selectedLabels, { allLabeled: false }),
);
