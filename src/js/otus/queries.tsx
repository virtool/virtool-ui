import { LoadingPlaceholder } from "@/base";
import { ErrorResponse } from "@/types/types";
import { useGetReference } from "@references/queries";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import {
    addIsolate,
    addSequence,
    createOTU,
    editIsolate,
    editOTU,
    editSequence,
    getOTU,
    getOTUHistory,
    listOTUs,
    removeIsolate,
    removeOTU,
    removeSequence,
    revertOTU,
    setIsolateAsDefault,
} from "./api";
import {
    OTU,
    OTUHistory,
    OTUIsolate,
    OTUSearchResult,
    OTUSegment,
    OTUSequence,
} from "./types";

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
 * @param verified - Filter the results to verified OTUs only
 * @returns A page of OTU search results
 */
export function useListOTUs(
    refId: string,
    page: number,
    per_page: number,
    term: string,
    verified?: boolean,
) {
    return useQuery<OTUSearchResult>({
        queryKey: OTUQueryKeys.list([page, per_page, term]),
        queryFn: () => listOTUs(refId, page, per_page, term, verified),
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetches a single OTU
 *
 * @param otuId - The id of the OTU to fetch
 * @returns A single OTU
 */
export function useFetchOTU(otuId: string) {
    return useQuery<OTU, ErrorResponse>({
        queryKey: OTUQueryKeys.detail(otuId),
        queryFn: () => getOTU(otuId),
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
export function useFetchOTUHistory(otuId: string) {
    return useQuery<OTUHistory[], ErrorResponse>({
        queryKey: OTUQueryKeys.history(otuId),
        queryFn: () => getOTUHistory(otuId),
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
        OTU,
        ErrorResponse,
        { name: string; abbreviation: string }
    >({
        mutationFn: ({ name, abbreviation }) =>
            createOTU(refId, name, abbreviation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: OTUQueryKeys.lists() });
        },
    });
}

export type UpdateOTUProps = {
    otuId: string;
    name?: string;
    abbreviation?: string;
    schema?: OTUSegment[];
};

/**
 * Initializes a mutator for editing an OTU
 *
 * @returns A mutator for editing an OTU
 */
export function useUpdateOTU(otuId: string) {
    const queryClient = useQueryClient();

    return useMutation<OTU, ErrorResponse, UpdateOTUProps>({
        mutationFn: ({ otuId, name, abbreviation, schema }) =>
            editOTU(otuId, name, abbreviation, schema),
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
        mutationFn: ({ otuId }) => removeOTU(otuId),
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
        mutationFn: ({ changeId }) => revertOTU(changeId),
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
        OTUIsolate,
        unknown,
        { otuId: string; sourceType: string; sourceName: string }
    >({
        mutationFn: ({ otuId, sourceType, sourceName }) =>
            addIsolate(otuId, sourceType, sourceName),
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
        OTUIsolate,
        ErrorResponse,
        { otuId: string; isolateId: string }
    >({
        mutationFn: ({ otuId, isolateId }) =>
            setIsolateAsDefault(otuId, isolateId),
    });
}

/**
 * Initializes a mutator for editing an OTU isolate
 *
 * @returns A mutator for editing an OTU isolate
 */
export function useUpdateIsolate() {
    return useMutation<
        OTUIsolate,
        unknown,
        {
            otuId: string;
            isolateId: string;
            sourceType: string;
            sourceName: string;
        }
    >({
        mutationFn: ({ otuId, isolateId, sourceType, sourceName }) =>
            editIsolate(otuId, isolateId, sourceType, sourceName),
    });
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveIsolate() {
    return useMutation<
        null,
        ErrorResponse,
        { otuId: string; isolateId: string }
    >({
        mutationFn: ({ otuId, isolateId }) => removeIsolate(otuId, isolateId),
    });
}

/**
 * Initializes a mutator for adding a sequence
 *
 * @returns A mutator for adding a sequence
 */
export function useCreateSequence(otuId: string) {
    const queryClient = useQueryClient();

    return useMutation<
        OTUSequence,
        unknown,
        {
            isolateId: string;
            accession: string;
            definition: string;
            host: string;
            sequence: string;
            segment?: string;
            target?: string;
        }
    >({
        mutationFn: ({
            isolateId,
            accession,
            definition,
            host,
            sequence,
            segment,
            target,
        }) =>
            addSequence(
                otuId,
                isolateId,
                accession,
                definition,
                host,
                sequence,
                segment,
                target,
            ),

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
        OTUSequence,
        unknown,
        {
            sequenceId: string;
            isolateId: string;
            accession: string;
            definition: string;
            host: string;
            sequence: string;
            segment?: string;
            target?: string;
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
            target,
        }) =>
            editSequence(
                otuId,
                isolateId,
                sequenceId,
                accession,
                definition,
                host,
                sequence,
                segment,
                target,
            ),
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
            removeSequence(otuId, isolateId, sequenceId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: OTUQueryKeys.detail(otuId),
            });
        },
    });
}

const CurrentOTUContext = createContext(null);

/**
 * Initializes a hook to access the current OTU context within a component
 *
 * @returns The current OTU context
 */
export function useCurrentOtuContext() {
    return useContext(CurrentOTUContext);
}

type CurrentOtuContextProviderProps = {
    children: React.ReactNode;
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
        useGetReference(refId);

    if (isPendingOTU || isPendingReference) {
        return <LoadingPlaceholder />;
    }

    return (
        <CurrentOTUContext.Provider value={{ otu, reference }}>
            {children}
        </CurrentOTUContext.Provider>
    );
}
