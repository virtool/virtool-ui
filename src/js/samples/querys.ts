import { forEach, map, reject, union } from "lodash-es/lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Label } from "../labels/types";
import { ErrorResponse } from "../types/types";
import {
    getSample,
    listSamples,
    SampleRightsUpdate,
    SampleRightsUpdateReturn,
    SampleUpdate,
    update,
    updateSample,
    updateSampleRights,
} from "./api";
import { Sample, SampleMinimal } from "./types";

type SampleLabel = Label & {
    /** Whether all selected samples contain the label */
    allLabeled: boolean;
};

/**
 * Factory for generating react-query keys for samples related queries.
 */
export const samplesQueryKeys = {
    all: () => ["samples"] as const,
    lists: () => ["samples", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["samples", "list", ...filters] as const,
    details: () => ["samples", "details"] as const,
    detail: (sampleId: string) => ["samples", "details", sampleId] as const,
};

/**
 * Fetch a page of samples from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of samples to fetch per page
 * @param term - The search term to filter samples by
 * @param labels - The labels to filter the samples by
 * @param workflows - The workflows to filter the samples by
 */
export function useListSamples(page: number, per_page: number, term?: string, labels?: string[], workflows?: string[]) {
    return useQuery(
        samplesQueryKeys.list([page, per_page, term, labels, workflows]),
        () => listSamples(page, per_page, term, labels, workflows),
        {
            keepPreviousData: true,
        },
    );
}

/**
 * Fetches a single sample
 *
 * @param sampleId - The id of the sample to fetch
 * @returns A single sample
 */
export function useFetchSample(sampleId: string) {
    return useQuery<Sample, ErrorResponse>(samplesQueryKeys.detail(sampleId), () => getSample(sampleId));
}

/**
 * Initializes a mutator for updating a sample
 *
 * @returns A mutator for updating a sample
 */
export function useUpdateSample(sampleId: string) {
    return useMutation<Sample, ErrorResponse, { update: SampleUpdate }>(({ update }) => updateSample(sampleId, update));
}

/**
 * Initializes a mutator for updating a samples rights
 *
 * @returns A mutator for updating a samples rights
 */
export function useUpdateSampleRights(sampleId: string) {
    return useMutation<SampleRightsUpdateReturn, unknown, { update: SampleRightsUpdate }>(({ update }) =>
        updateSampleRights(sampleId, update),
    );
}

/**
 * Updates the labels for selected samples
 *
 * @param selectedLabels - The initial labels associated with the sample
 * @param selectedSamples - The selected samples
 */
export function useUpdateLabel(selectedLabels: SampleLabel[], selectedSamples: SampleMinimal[]) {
    const queryClient = useQueryClient();
    const mutation = useMutation(update, {
        onSuccess: () => {
            queryClient.invalidateQueries(samplesQueryKeys.lists());
        },
    });

    function onUpdate(label: number) {
        forEach(selectedSamples, sample => {
            const sampleLabelIds = map(sample.labels, label => label.id);
            const labelExists = selectedLabels.some(item => item.id === label);
            const allLabeled = selectedLabels.every(item => item.allLabeled === true);

            if (!labelExists || !allLabeled) {
                mutation.mutate({
                    sampleId: sample.id,
                    update: { labels: union(sampleLabelIds, [label]) },
                });
            } else {
                mutation.mutate({
                    sampleId: sample.id,
                    update: {
                        labels: reject(sampleLabelIds, id => label === id),
                    },
                });
            }
        });
    }

    return onUpdate;
}
