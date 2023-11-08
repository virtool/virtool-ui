import { forEach, map, reject, union } from "lodash-es/lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { update } from "./api";
import { SampleMinimal } from "./types";

type Labels = {
    /** The hex encoded color */
    color: string;
    /** The detailed description */
    description: string;
    /** The unique identifier */
    id: number;
    /** The display name */
    name: string;
    /** Whether all selected samples contain the label */
    allLabeled: boolean;
};

/**
 * Factory for generating react-query keys for samples related queries.
 */
export const samplesQueryKeys = {
    lists: () => ["samples", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["samples", "list", ...filters] as const,
};

/**
 * Fetch a page of samples
 *
 * @param page - The page to fetch
 * @param per_page - The number of samples to fetch per page
 * @param term - The search term to filter samples by
 * @param labels - Filter the samples by labels
 * @param workflows - Filter the samples by workflows
 */
function findSamples(page: number, per_page: number, term: string, labels: string[], workflows: string) {
    const request = Request.get("/samples").query({ page, per_page, find: term });

    if (labels) {
        labels.forEach(label => request.query({ label }));
    }

    if (workflows) {
        request.query({ workflows });
    }

    return request.then(res => res.body);
}

/**
 * Get the labels from the URL parameters
 */
export const getLabelsFromURL = () => {
    if (window.location.search) {
        const search = new URLSearchParams(window.location.search);
        const labels = search.getAll("label");

        return labels;
    }

    return [];
};

/**
 * Fetch a page of samples from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 */
export function useFindSamples(page: number, per_page: number, term?: string) {
    const labels = getLabelsFromURL();
    const params = new URLSearchParams(window.location.search);
    const workflows = params.get("workflows");

    return useQuery(
        samplesQueryKeys.list([page, per_page, term, labels, workflows]),
        () => findSamples(page, per_page, term, labels, workflows),
        {
            keepPreviousData: true,
        },
    );
}

/**
 * Updates the labels for selected samples
 *
 * @param selectedLabels - The initial labels associated with the sample
 * @param selectedSamples - The selected samples
 */
export function useUpdateLabel(selectedLabels: Labels[], selectedSamples: SampleMinimal[]) {
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
                mutation.mutate({ sampleId: sample.id, update: { labels: union(sampleLabelIds, [label]) } });
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
