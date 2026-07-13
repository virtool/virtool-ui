import { apiClient } from "@app/api";
import type { LabelNested } from "@labels/types";
import { samplesQueryKeys } from "@samples/keys";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { fileQueryKeys } from "@uploads/keys";
import { union } from "es-toolkit";
import type { ErrorResponse } from "@/types/api";
import type {
	CreateSampleRequest,
	Sample,
	SampleMinimal,
	SampleRightsUpdate,
	SampleRightsUpdateReturn,
	SampleSearchResult,
	SampleUpdate,
} from "./types";

/** A label carried by at least one of the selected samples */
export type SampleLabel = LabelNested & {
	/** Whether all selected samples contain the label */
	allLabeled: boolean;
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
 * @param users - The ids of the users to filter the samples by
 */
export function useListSamples(
	page: number,
	per_page: number,
	term?: string,
	labels?: number[],
	workflows?: string[],
	users?: number[],
) {
	return useQuery<SampleSearchResult, ErrorResponse>({
		queryKey: samplesQueryKeys.list([
			page,
			per_page,
			term,
			labels,
			workflows,
			users,
		]),
		queryFn: () =>
			apiClient
				.get("/samples")
				.query({
					page,
					per_page,
					find: term,
					label: labels,
					workflows,
					user: users,
				})
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
 * Fetch a sample, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`. Use this from
 * components rendered under a route whose loader prefetches the sample (the
 * `$sampleId` detail layout and its children) — loading and errors are handled
 * by the route's Suspense and `errorComponent` rather than inline.
 */
export function useSuspenseSample(sampleId: string) {
	return useSuspenseQuery(sampleQueryOptions(sampleId));
}

/**
 * Creates a sample.
 *
 * Shared by the single-sample create hook and the bulk create hook.
 */
function createSample({
	name,
	isolate,
	host,
	locale,
	libraryType,
	subtractions,
	files,
	labels,
	group,
}: CreateSampleRequest): Promise<Sample> {
	return apiClient
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
		.then((res) => res.body);
}

/**
 * Initialize a mutator for creating a sample
 *
 * @returns A mutator for creating a sample
 */
export function useCreateSample() {
	const queryClient = useQueryClient();

	return useMutation<Sample, ErrorResponse, CreateSampleRequest>({
		mutationFn: createSample,
		onSuccess: () => {
			// The created sample reserves its read files, so the server stops
			// returning them. Refetch the uploads lists to drop them from the
			// selector.
			queryClient.invalidateQueries({ queryKey: fileQueryKeys.lists() });
		},
	});
}

/**
 * The result of creating one sample in a batch. A batch reports every sample's
 * outcome rather than failing as a whole, so the samples that were created
 * aren't lost when one of their siblings is rejected.
 */
export type SampleCreationOutcome =
	| { status: "created"; sample: Sample }
	| { status: "failed"; message: string };

/**
 * Initialize a mutator for creating several samples at once.
 *
 * Every sample is requested, even when an earlier one fails. The outcomes are
 * returned in the order the requests were given, so the caller can match each
 * one back to the row it came from.
 *
 * @returns A mutator for creating several samples
 */
export function useCreateSamples() {
	const queryClient = useQueryClient();

	return useMutation<
		SampleCreationOutcome[],
		ErrorResponse,
		CreateSampleRequest[]
	>({
		mutationFn: (requests) =>
			Promise.all(
				requests.map((request) =>
					createSample(request).then(
						(sample): SampleCreationOutcome => ({
							status: "created",
							sample,
						}),
						(error: ErrorResponse): SampleCreationOutcome => ({
							status: "failed",
							message:
								error.response?.body.message ?? "Could not create sample",
						}),
					),
				),
			),
		// Settled, not success: samples created before a sibling failed still
		// reserve their read files, so the uploads lists have to be refreshed
		// either way.
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: fileQueryKeys.lists() });
		},
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
 * Initialize a mutator that adds or removes a label across the selected samples
 *
 * The label is removed when every selected sample already carries it, and added
 * otherwise. The samples are patched concurrently and the list is invalidated
 * once, after they all settle. The mutation resolves with the updated samples.
 *
 * @param selectedLabels - The labels carried by the selected samples
 * @param selectedSamples - The selected samples
 * @returns A mutator taking the id of the label to toggle
 */
export function useUpdateLabel(
	selectedLabels: SampleLabel[],
	selectedSamples: SampleMinimal[],
) {
	const queryClient = useQueryClient();

	return useMutation<Sample[], ErrorResponse, number>({
		mutationFn: (labelId) => {
			const clicked = selectedLabels.find((label) => label.id === labelId);
			const allLabeled = clicked?.allLabeled === true;

			return Promise.all(
				selectedSamples.map((sample) => {
					const labelIds = sample.labels.map((label) => label.id);

					return updateSample(sample.id, {
						labels: allLabeled
							? labelIds.filter((id) => id !== labelId)
							: union(labelIds, [labelId]),
					});
				}),
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: samplesQueryKeys.lists(),
			});
		},
	});
}
