import { apiClient } from "@app/api";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import { otuQueryKeys } from "./keys";
import type {
	Genbank,
	Otu,
	OtuHistory,
	OtuIsolate,
	OtuSearchResult,
	OtuSegment,
	OtuSequence,
} from "./types";

/**
 * Initializes a mutator for looking up a sequence in Genbank by accession
 *
 * This is a read, but it is driven by a button press rather than by what is on
 * screen, so it is a mutation: nothing should fetch it on render, and the
 * result is not worth caching.
 *
 * @returns A mutator that takes the accession identifying the sequence
 */
export function useGetGenbank() {
	return useMutation<Genbank, ErrorResponse, string>({
		mutationFn: (accession) =>
			apiClient.get(`/genbank/${accession}`).then((res) => res.body),
	});
}

/**
 * Fetches a page of OTU search results from the API
 *
 * @param refId - The reference id to fetch the OTUs of
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter indexes by
 * @returns A page of OTU search results
 */
export function useListOtus(
	refId: string,
	page: number,
	per_page: number,
	term: string,
) {
	return useQuery<OtuSearchResult>({
		queryKey: otuQueryKeys.list([page, per_page, term]),
		queryFn: () =>
			apiClient
				.get(`/refs/${refId}/otus`)
				.query({ find: term, page, per_page })
				.then((res) => {
					const { documents, ...rest } = res.body;
					return { ...rest, items: documents };
				}),
		placeholderData: keepPreviousData,
	});
}

export function otuQueryOptions(otuId: string) {
	return queryOptions<Otu, ErrorResponse>({
		queryKey: otuQueryKeys.detail(otuId),
		queryFn: () => apiClient.get(`/otus/${otuId}`).then((res) => res.body),
	});
}

/**
 * Fetches a single OTU
 *
 * @param otuId - The id of the OTU to fetch
 * @returns A single OTU
 */
export function useFetchOtu(otuId: string) {
	return useQuery<Otu, ErrorResponse>({
		...otuQueryOptions(otuId),
		retry: (failureCount, error) => {
			if (error.response?.status === 404) {
				return false;
			}
			return failureCount <= 3;
		},
	});
}

export function otuHistoryQueryOptions(otuId: string) {
	return queryOptions<OtuHistory[], ErrorResponse>({
		queryKey: otuQueryKeys.history(otuId),
		queryFn: () =>
			apiClient.get(`/otus/${otuId}/history`).then((res) => res.body),
	});
}

/**
 * Fetch an OTU's history, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`.
 */
export function useSuspenseOtuHistory(otuId: string) {
	return useSuspenseQuery(otuHistoryQueryOptions(otuId));
}

/**
 * Initializes a mutator for creating an OTU
 *
 * @returns A mutator for creating an OTU
 */
export function useCreateOtu(refId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		Otu,
		ErrorResponse,
		{ name: string; abbreviation: string }
	>({
		mutationFn: ({ name, abbreviation }) =>
			apiClient
				.post(`/refs/${refId}/otus`)
				.send({ name, abbreviation })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: otuQueryKeys.lists() });
		},
	});
}

export type UpdateOtuProps = {
	otuId: string;
	name?: string;
	abbreviation?: string;
	schema?: OtuSegment[];
};

/**
 * Initializes a mutator for editing an OTU
 *
 * @returns A mutator for editing an OTU
 */
export function useUpdateOtu(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<Otu, ErrorResponse, UpdateOtuProps, { previousOtu?: Otu }>(
		{
			mutationFn: ({ otuId, name, abbreviation, schema }) =>
				apiClient
					.patch(`/otus/${otuId}`)
					.send({ name, abbreviation, schema })
					.then((res) => res.body),
			onMutate: async ({ name, abbreviation, schema }) => {
				await queryClient.cancelQueries({
					queryKey: otuQueryKeys.detail(otuId),
				});

				const previousOtu = queryClient.getQueryData<Otu>(
					otuQueryKeys.detail(otuId),
				);

				if (previousOtu) {
					queryClient.setQueryData<Otu>(otuQueryKeys.detail(otuId), {
						...previousOtu,
						...(name !== undefined && { name }),
						...(abbreviation !== undefined && { abbreviation }),
						...(schema !== undefined && { schema }),
					});
				}

				return { previousOtu };
			},
			onError: (_error, _variables, context) => {
				if (context?.previousOtu) {
					queryClient.setQueryData(
						otuQueryKeys.detail(otuId),
						context.previousOtu,
					);
				}
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: otuQueryKeys.detail(otuId),
				});
			},
		},
	);
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveOtu() {
	return useMutation<null, ErrorResponse, { otuId: string }>({
		mutationFn: ({ otuId }) =>
			apiClient.delete(`/otus/${otuId}`).then((res) => res.body),
	});
}

/**
 * Initializes a mutator for creating an OTU isolate
 *
 * @returns A mutator for creating an OTU isolate
 */
export function useCreateIsolate(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		OtuIsolate,
		unknown,
		{ otuId: string; sourceType: string; sourceName: string }
	>({
		mutationFn: ({ otuId, sourceType, sourceName }) =>
			apiClient
				.post(`/otus/${otuId}/isolates`)
				.send({ source_type: sourceType, source_name: sourceName })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for setting an isolate as the default resource for an OTU
 *
 * @returns A mutator for setting an isolate as the default resource for an OTU
 */
export function useSetIsolateAsDefault() {
	const queryClient = useQueryClient();

	return useMutation<
		OtuIsolate,
		ErrorResponse,
		{ otuId: string; isolateId: string }
	>({
		mutationFn: ({ otuId, isolateId }) =>
			apiClient
				.put(`/otus/${otuId}/isolates/${isolateId}/default`)
				.then((res) => res.body),
		onSuccess: (_, { otuId }) => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for editing an OTU isolate
 *
 * @returns A mutator for editing an OTU isolate
 */
export function useUpdateIsolate() {
	const queryClient = useQueryClient();

	return useMutation<
		OtuIsolate,
		unknown,
		{
			otuId: string;
			isolateId: string;
			sourceType: string;
			sourceName: string;
		}
	>({
		mutationFn: ({ otuId, isolateId, sourceType, sourceName }) =>
			apiClient
				.patch(`/otus/${otuId}/isolates/${isolateId}`)
				.send({ source_type: sourceType, source_name: sourceName })
				.then((res) => res.body),
		onSuccess: (_, { otuId }) => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveIsolate() {
	const queryClient = useQueryClient();

	return useMutation<null, ErrorResponse, { otuId: string; isolateId: string }>(
		{
			mutationFn: ({ otuId, isolateId }) =>
				apiClient
					.delete(`/otus/${otuId}/isolates/${isolateId}`)
					.then((res) => res.body),
			onSuccess: (_, { otuId }) => {
				queryClient.invalidateQueries({
					queryKey: otuQueryKeys.detail(otuId),
				});
			},
		},
	);
}

/**
 * Initializes a mutator for adding a sequence
 *
 * @returns A mutator for adding a sequence
 */
export function useCreateSequence(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		OtuSequence,
		unknown,
		{
			isolateId: string;
			accession: string;
			definition: string;
			host: string;
			sequence: string;
			segment?: string;
		}
	>({
		mutationFn: ({
			isolateId,
			accession,
			definition,
			host,
			sequence,
			segment,
		}) =>
			apiClient
				.post(`/otus/${otuId}/isolates/${isolateId}/sequences`)
				.send({ accession, definition, host, sequence, segment })
				.then((res) => res.body),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for editing a sequence
 *
 * @returns A mutator for editing a sequence
 */
export function useEditSequence(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		OtuSequence,
		unknown,
		{
			sequenceId: string;
			isolateId: string;
			accession: string;
			definition: string;
			host: string;
			sequence: string;
			segment?: string;
		}
	>({
		mutationFn: ({
			isolateId,
			sequenceId,
			accession,
			definition,
			host,
			sequence,
			segment,
		}) =>
			apiClient
				.patch(`/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`)
				.send({ accession, definition, host, sequence, segment })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for removing a sequence
 *
 * @returns A mutator for removing a sequence
 */
export function useRemoveSequence(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<
		null,
		ErrorResponse,
		{ otuId: string; isolateId: string; sequenceId: string }
	>({
		mutationFn: ({ otuId, isolateId, sequenceId }) =>
			apiClient
				.delete(`/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`)
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: otuQueryKeys.detail(otuId),
			});
		},
	});
}
