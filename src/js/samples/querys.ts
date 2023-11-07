import { forEach, map, reject, union } from "lodash-es/lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Request } from "../app/request";
import { update } from "./api";

export const samplesQueryKeys = {
    lists: () => ["samples", "list"] as const,
    list: (filters: Array<string | number | boolean | string[]>) => ["samples", "list", ...filters] as const,
};

function findSamples(page, per_page, term, labels, workflows) {
    const request = Request.get("/samples").query({ page, per_page, find: term });

    if (labels) {
        labels.forEach(label => request.query({ label }));
    }

    if (workflows) {
        request.query({ workflows });
    }

    return request.then(res => res.body);
}

export const getLabelsFromURL = () => {
    if (window.location.search) {
        const search = new URLSearchParams(window.location.search);
        const labels = search.getAll("label");

        return labels;
    }

    return [];
};

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

export function useUpdateLabel(selectedLabels, selectedSamples) {
    const queryClient = useQueryClient();
    const mutation = useMutation(update, {
        onSuccess: () => {
            queryClient.invalidateQueries(samplesQueryKeys.lists());
        },
    });

    function onUpdate(label) {
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
