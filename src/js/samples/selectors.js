import { every, filter, forEach, get, includes, intersectionWith, mapValues, reduce, some, toNumber } from "lodash-es";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";
import { getAccountAdministratorRole, getAccountId } from "../account/selectors";
import { AdministratorRoles } from "../administration/types";
import { hasSufficientAdminRole } from "../administration/utils";
import { getTermSelectorFactory } from "../utils/selectors";

export const getSampleGroups = state => state.account.groups;
export const getSampleDetail = state => state.samples.detail;
export const getSampleDetailId = state => get(state, "samples.detail.id");
export const getSampleLibraryType = state => get(state, "samples.detail.library_type");
export const getSampleDocuments = state => state.samples.documents;
export const getSelectedSampleIds = state => state.samples.selected;

export const getCanModify = createSelector(
    [getAccountAdministratorRole, getSampleGroups, getSampleDetail, getAccountId],
    (administratorRole, groups, sample, userId) => {
        if (sample) {
            return (
                hasSufficientAdminRole(AdministratorRoles.FULL, administratorRole) ||
                sample.all_write ||
                sample.user.id === userId ||
                (sample.group_write && includes(groups, sample.group))
            );
        }
        return false;
    },
);

export const getCanModifyRights = createSelector(
    [getAccountAdministratorRole, getAccountId, getSampleDetail],
    (administratorRole, userId, sample) => {
        if (sample === null) {
            return false;
        }

        return hasSufficientAdminRole(AdministratorRoles.FULL, administratorRole) || sample.user.id === userId;
    },
);

export const getDefaultSubtractions = state => state.samples.detail.subtractions;
export const getSubtractionOptions = state => state.subtraction.shortlist;

export const getMaxReadLength = state => state.samples.detail.quality.length[1];

export const getSampleFiles = state => state.samples.detail.files;
export const getSampleLabels = state => state.samples.detail.labels;

export const getHasRawFilesOnly = createSelector([getSampleFiles], files => every(files, "raw"));

export const getTerm = getTermSelectorFactory(state => state.samples.term);

export const getTermFromURL = state => {
    if (state.router.location.search) {
        const search = new URLSearchParams(state.router.location.search);
        const term = search.get("find");

        if (term) {
            return term;
        }
    }

    return "";
};

export const getLabelsFromURL = state => {
    if (state.router.location.search) {
        const search = new URLSearchParams(state.router.location.search);
        const labels = search.getAll("label");

        if (labels) {
            return labels.map(label => toNumber(label));
        }
    }

    return [];
};

export const getWorkflowsFromURL = state => {
    const workflowFilter = {
        aodp: [],
        nuvs: [],
        pathoscope: [],
    };

    const search = new URLSearchParams(state.router.location.search);
    const workflows = search.get("workflows");

    if (workflows) {
        workflows.split(" ").forEach(workflowFlag => {
            const [workflow, condition] = workflowFlag.split(":");
            workflowFilter[workflow].push(condition);
        });
    }

    return workflowFilter;
};

export const getIsSelected = createCachedSelector(
    [getSelectedSampleIds, (state, sampleId) => sampleId],
    (selectedSampleIds, sampleId) => includes(selectedSampleIds, sampleId),
)((state, sampleId) => sampleId);

export const getSelectedSamples = createSelector([getSelectedSampleIds, getSampleDocuments], (selected, documents) =>
    intersectionWith(documents, selected, (document, selectedSample) => document.id === selectedSample),
);

export const getFilesUndersized = state => some(state.samples.detail.files, file => file.size < 10000000);

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
