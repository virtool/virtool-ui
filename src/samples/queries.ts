import { ErrorResponse } from "@/types/api";
import { Label } from "@labels/types";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { forEach, map, reject, union } from "lodash-es/lodash";
import {
    createSample,
    getSample,
    listSamples,
    removeSample,
    SampleRightsUpdate,
    SampleRightsUpdateReturn,
    SampleUpdate,
    updateSample,
    updateSampleRights,
} from "./api";
import { Sample, SampleMinimal, SampleSearchResult } from "./types";

export type SampleLabel = Label & {
    /** Whether all selected samples contain the label */
    allLabeled: boolean;
};

/**
 * Factory for generating react-query keys for samples related queries.
 */
export const samplesQueryKeys = {
    all: () => ["samples"] as const,
    lists: () => ["samples", "list"] as const,
    list: (filters: Array<string | number | boolean | string[] | number[]>) =>
        ["samples", "list", ...filters] as const,
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
export function useListSamples(
    page: number,
    per_page: number,
    term?: string,
    labels?: number[],
    workflows?: string[],
) {
    return useQuery<SampleSearchResult, ErrorResponse>({
        queryKey: samplesQueryKeys.list([
            page,
            per_page,
            term,
            labels,
            workflows,
        ]),
        queryFn: () => listSamples(page, per_page, term, labels, workflows),
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetches a single sample
 *
 * @param sampleId - The id of the sample to fetch
 * @returns A single sample
 */
export function useFetchSample(sampleId: string) {
    return useQuery<Sample, ErrorResponse>({
        queryKey: samplesQueryKeys.detail(sampleId),
        queryFn: () => getSample(sampleId),
    });
}

/**
 * Initialize a mutator for creating a sample
 *
 * @returns A mutator for creating a sample
 */
export function useCreateSample() {
    return useMutation<
        Sample,
        ErrorResponse,
        {
            name: string;
            isolate: string;
            host: string;
            locale: string;
            libraryType: string;
            subtractions: string[];
            files: string[];
            labels: number[];
            group: string;
        }
    >({
        mutationFn: ({
            name,
            isolate,
            host,
            locale,
            libraryType,
            subtractions,
            files,
            labels,
            group,
        }) =>
            createSample(
                name,
                isolate,
                host,
                locale,
                libraryType,
                subtractions,
                files,
                labels,
                group,
            ),
    });
}

/**
 * Initialize a mutator for updating a sample
 *
 * @returns A mutator for updating a sample
 */
export function useUpdateSample(sampleId: string) {
    const queryClient = useQueryClient();

    return useMutation<Sample, ErrorResponse, { update: SampleUpdate }>({
        mutationFn: ({ update }) => updateSample(sampleId, update),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: samplesQueryKeys.detail(sampleId),
            });
        },
    });
}

/**
 * Initialize a mutator for removing a sample
 *
 * @returns A mutator for removing a sample
 */
export function useRemoveSample() {
    return useMutation<null, unknown, { sampleId: string }>({
        mutationFn: ({ sampleId }) => removeSample(sampleId),
    });
}

/**
 * Initialize a mutator for updating a samples rights
 *
 * @returns A mutator for updating a samples rights
 */
export function useUpdateSampleRights(sampleId: string) {
    return useMutation<
        SampleRightsUpdateReturn,
        unknown,
        { update: SampleRightsUpdate }
    >({
        mutationFn: ({ update }) => updateSampleRights(sampleId, update),
    });
}

/**
 * Updates the labels for selected samples
 *
 * @param selectedLabels - The initial labels associated with the sample
 * @param selectedSamples - The selected samples
 */
export function useUpdateLabel(
    selectedLabels: SampleLabel[],
    selectedSamples: SampleMinimal[],
) {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        Sample,
        ErrorResponse,
        { sampleId: string; update: SampleUpdate }
    >({
        mutationFn: ({ sampleId, update }) => updateSample(sampleId, update),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: samplesQueryKeys.lists(),
            });
        },
    });

    function onUpdate(label: number) {
        forEach(selectedSamples, (sample) => {
            const sampleLabelIds = map(sample.labels, (label) => label.id);
            const labelExists = selectedLabels.some(
                (item) => item.id === label,
            );
            const allLabeled = selectedLabels.every(
                (item) => item.allLabeled === true,
            );

            if (!labelExists || !allLabeled) {
                mutation.mutate({
                    sampleId: sample.id,
                    update: { labels: union(sampleLabelIds, [label]) },
                });
            } else {
                mutation.mutate({
                    sampleId: sample.id,
                    update: {
                        labels: reject(sampleLabelIds, (id) => label === id),
                    },
                });
            }
        });
    }

    return onUpdate;
}
