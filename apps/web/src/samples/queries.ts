import { apiClient } from "@app/api";
import type { Label } from "@labels/types";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { union } from "es-toolkit";
import type { ErrorResponse } from "@/types/api";
import type {
	Sample,
	SampleMinimal,
	SampleRightsUpdate,
	SampleRightsUpdateReturn,
	SampleSearchResult,
	SampleUpdate,
} from "./types";

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
	list: (
		filters: Array<string | number | boolean | string[] | number[] | undefined>,
	) => ["samples", "list", ...filters] as const,
	details: () => ["samples", "details"] as const,
	detail: (sampleId: string) => ["samples", "details", sampleId] as const,
};

/**
 * Updates the data for a sample.
 *
 * Shared by the single-sample update hook and the bulk label-update hook.
 */
function updateSample(sampleId: string, update: SampleUpdate): Promise<Sample> {
	return apiClient
		.patch(`/samples/${sampleId}`)
		.send(update)
		.then((response) => response.body);
}

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
		queryKey: samplesQueryKeys.list([page, per_page, term, labels, workflows]),
		queryFn: () =>
			apiClient
				.get("/samples")
				.query({ page, per_page, find: term, label: labels, workflows })
				.then((res) => {
					const { documents, ...rest } = res.body;
					return { ...rest, items: documents };
				}),
		placeholderData: keepPreviousData,
	});
}

export function sampleQueryOptions(sampleId: string) {
	return queryOptions<Sample, ErrorResponse>({
		queryKey: samplesQueryKeys.detail(sampleId),
		queryFn: () =>
			apiClient.get(`/samples/${sampleId}`).then((res) => res.body),
	});
}

export function useFetchSample(sampleId: string) {
	return useQuery(sampleQueryOptions(sampleId));
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
			files: number[];
			labels: number[];
			group: string | null;
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
			apiClient
				.post("/samples")
				.send({
					name,
					isolate,
					host,
					locale,
					subtractions,
					files,
					library_type: libraryType,
					labels,
					group,
				})
				.then((res) => res.body),
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
		mutationFn: ({ sampleId }) =>
			apiClient
				.delete(`/samples/${sampleId}`)
				.then((response) => response.body),
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
		mutationFn: ({ update }) =>
			apiClient
				.patch(`/samples/${sampleId}/rights`)
				.send(update)
				.then((response) => response.body),
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
		selectedSamples.forEach((sample) => {
			const sampleLabelIds = sample.labels.map((l) => l.id);
			const labelExists = selectedLabels.some((item) => item.id === label);
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
						labels: sampleLabelIds.filter((id) => label !== id),
					},
				});
			}
		});
	}

	return onUpdate;
}
