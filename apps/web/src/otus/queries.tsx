import { apiClient } from "@app/api";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import type { ErrorResponse } from "@/types/api";
import { useFetchReference } from "../references/queries";
import type { Reference } from "../references/types";
import type {
	Otu,
	OtuHistory,
	OtuIsolate,
	OtuSearchResult,
	OtuSegment,
	OtuSequence,
} from "./types";

/**
 * Get the Genbank data for a sequence
 *
 * @param accession - The unique accession identifying the sequence in genbank
 * @returns A Promise resolving to the genbank sequence data
 */
export function getGenbank(accession: string) {
	return apiClient.get(`/genbank/${accession}`).then((res) => res.body);
}

/**
 * Factory for generating react-query keys for otu related queries.
 */
export const OTUQueryKeys = {
	all: () => ["OTU"] as const,
	lists: () => ["OTU", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["OTU", "list", ...filters] as const,
	infiniteLists: () => ["OTU", "list", "infinite"] as const,
	infiniteList: (filters: Array<string | number | boolean>) =>
		["OTU", "list", "infinite", ...filters] as const,
	details: () => ["OTU", "detail"] as const,
	detail: (id: string) => ["OTU", "detail", id] as const,
	histories: () => ["OTU", "detail", "history"] as const,
	history: (id: string) => ["OTU", "detail", "history", id] as const,
};

/**
 * Fetches a page of OTU search results from the API
 *
 * @param refId - The reference id to fetch the OTUs of
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param term - The search term to filter indexes by
 * @returns A page of OTU search results
 */
export function useListOTUs(
	refId: string,
	page: number,
	per_page: number,
	term: string,
) {
	return useQuery<OtuSearchResult>({
		queryKey: OTUQueryKeys.list([page, per_page, term]),
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
		queryKey: OTUQueryKeys.detail(otuId),
		queryFn: () => apiClient.get(`/otus/${otuId}`).then((res) => res.body),
	});
}

/**
 * Fetches a single OTU
 *
 * @param otuId - The id of the OTU to fetch
 * @returns A single OTU
 */
export function useFetchOTU(otuId: string) {
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

/**
 * Fetches the history of changes for a single OTU
 *
 * @param otuId - The id of the OTU to fetch
 * @returns A history list of changes for a single OTU
 */
export function useFetchOtuHistory(otuId: string) {
	return useQuery<OtuHistory[], ErrorResponse>({
		queryKey: OTUQueryKeys.history(otuId),
		queryFn: () =>
			apiClient.get(`/otus/${otuId}/history`).then((res) => res.body),
	});
}

/**
 * Initializes a mutator for creating an OTU
 *
 * @returns A mutator for creating an OTU
 */
export function useCreateOTU(refId: string) {
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
			queryClient.invalidateQueries({ queryKey: OTUQueryKeys.lists() });
		},
	});
}

export type UpdateOTUProps = {
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
export function useUpdateOTU(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<Otu, ErrorResponse, UpdateOTUProps>({
		mutationFn: ({ otuId, name, abbreviation, schema }) =>
			apiClient
				.patch(`/otus/${otuId}`)
				.send({ name, abbreviation, schema })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: OTUQueryKeys.detail(otuId),
			});
		},
	});
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveOTU() {
	return useMutation<null, ErrorResponse, { otuId: string }>({
		mutationFn: ({ otuId }) =>
			apiClient.delete(`/otus/${otuId}`).then((res) => res.body),
	});
}

/**
 * Initializes a mutator for reverting an otu to how it was before a given change
 *
 * @returns A mutator for reverting an otu to how it was before a given change
 */
export function useRevertOTU(otuId: string) {
	const queryClient = useQueryClient();

	return useMutation<null, ErrorResponse, { changeId: string }>({
		mutationFn: ({ changeId }) =>
			apiClient.delete(`/history/${changeId}`).then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: OTUQueryKeys.detail(otuId),
			});
		},
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
				queryKey: OTUQueryKeys.detail(otuId),
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
	return useMutation<
		OtuIsolate,
		ErrorResponse,
		{ otuId: string; isolateId: string }
	>({
		mutationFn: ({ otuId, isolateId }) =>
			apiClient
				.put(`/otus/${otuId}/isolates/${isolateId}/default`)
				.then((res) => res.body),
	});
}

/**
 * Initializes a mutator for editing an OTU isolate
 *
 * @returns A mutator for editing an OTU isolate
 */
export function useUpdateIsolate() {
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
	});
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveIsolate() {
	return useMutation<null, ErrorResponse, { otuId: string; isolateId: string }>(
		{
			mutationFn: ({ otuId, isolateId }) =>
				apiClient
					.delete(`/otus/${otuId}/isolates/${isolateId}`)
					.then((res) => res.body),
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
				queryKey: OTUQueryKeys.detail(otuId),
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
				queryKey: OTUQueryKeys.detail(otuId),
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
				queryKey: OTUQueryKeys.detail(otuId),
			});
		},
	});
}

type CurrentOtuContextValue = {
	otu: Otu;
	reference: Reference;
};

const CurrentOTUContext = createContext<CurrentOtuContextValue | null>(null);

/**
 * Initializes a hook to access the current OTU context within a component
 *
 * @returns The current OTU context
 */
export function useCurrentOtuContext() {
	const context = useContext(CurrentOTUContext);

	if (!context) {
		throw new Error(
			"useCurrentOtuContext must be used within a CurrentOtuContextProvider",
		);
	}

	return context;
}

type CurrentOtuContextProviderProps = {
	children: ReactNode;
	otuId: string;
	refId: string;
};

/**
 * Provides the current OTU context to children components
 *
 * @returns Element wrapping children components with the current OTU context
 */
export function CurrentOtuContextProvider({
	children,
	otuId,
	refId,
}: CurrentOtuContextProviderProps) {
	const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);
	const { data: reference, isPending: isPendingReference } =
		useFetchReference(refId);

	if (isPendingOTU || isPendingReference || !otu || !reference) {
		return <LoadingPlaceholder />;
	}

	return (
		<CurrentOTUContext.Provider value={{ otu, reference }}>
			{children}
		</CurrentOTUContext.Provider>
	);
}
