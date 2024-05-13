import { ErrorResponse } from "@/types/types";
import { Request } from "@app/request";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHistory } from "react-router-dom";
import {
    addReferenceGroup,
    addReferenceUser,
    checkRemoteReferenceUpdates,
    cloneReference,
    createReference,
    editReferenceGroup,
    editReferenceUser,
    findReferences,
    getReference,
    remoteReference,
    removeReference,
    removeReferenceGroup,
    removeReferenceUser,
    updateRemoteReference,
} from "./api";
import {
    Reference,
    ReferenceDataType,
    ReferenceGroup,
    ReferenceMinimal,
    ReferenceSearchResult,
    ReferenceTarget,
    ReferenceUser,
} from "./types";

/**
 * Factory for generating react-query keys for reference related queries.
 */
export const referenceQueryKeys = {
    all: () => ["reference"] as const,
    lists: () => ["reference", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["reference", "list", "single", ...filters] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["reference", "list", "infinite", ...filters] as const,
    details: () => ["reference", "detail"] as const,
    detail: (refId: string) => ["reference", "detail", refId] as const,
};

/**
 * Gets a paginated list of references
 *
 * @param term - The search term to filter references by
 * @returns The paginated list of references
 */
export function useInfiniteFindReferences(term: string) {
    return useInfiniteQuery<ReferenceSearchResult>(
        referenceQueryKeys.infiniteList([term]),
        ({ pageParam }) => findReferences({ page: pageParam, per_page: 25, term }),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
            keepPreviousData: true,
        },
    );
}

/**
 * Initializes a mutator for cloning a reference
 *
 * @returns A mutator for cloning a reference
 */
export function useCloneReference() {
    return useMutation<ReferenceMinimal, unknown, { name: string; description: string; refId: string }>(cloneReference);
}

/**
 * Initializes a mutator for remotely installing a reference
 *
 * @returns A mutator for remotely installing a reference
 */
export function useRemoteReference() {
    const queryClient = useQueryClient();

    return useMutation<Reference, unknown, { remotes_from: string }>(
        ({ remotes_from }) => remoteReference(remotes_from),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(referenceQueryKeys.lists());
            },
        },
    );
}

/**
 * Initializes a mutator for creating an empty reference
 *
 * @returns A mutator for creating an empty reference
 */
export function useCreateReference() {
    const history = useHistory();

    return useMutation<
        Reference,
        unknown,
        { name: string; description: string; dataType: ReferenceDataType; organism: string }
    >(({ name, description, dataType, organism }) => createReference(name, description, dataType, organism), {
        onSuccess: () => {
            history.push("/refs", { emptyReference: false });
        },
    });
}

/**
 * Initializes a mutator for removing a reference
 *
 * @returns A mutator for removing a reference
 */
export function useRemoveReference() {
    return useMutation<null, unknown, { refId: string }>(({ refId }) => removeReference(refId));
}

/**
 * Initializes a mutator for updating a reference
 *
 * @returns A mutator for updating a reference
 */
export function useUpdateReference(refId: string, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const mutation = useMutation<Reference, ErrorResponse, unknown>(
        (data: { restrict_source_types?: boolean; targets?: ReferenceTarget[] }) => {
            return Request.patch(`/refs/${refId}`)
                .send(data)
                .then(res => res.body);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(referenceQueryKeys.detail(refId)).then(() => onSuccess && onSuccess());
            },
        },
    );

    return { mutation };
}

/**
 * Initializes a mutator for adding members to a reference
 *
 * @param refId - The reference to add the member to
 * @param noun - Whether the member is a user or a group
 * @returns A mutator for adding members to a reference
 */
export function useAddReferenceMember(refId: string, noun: string) {
    const queryClient = useQueryClient();

    return useMutation<ReferenceUser | ReferenceGroup, unknown, { id: string | number }>(
        ({ id }) => (noun === "user" ? addReferenceUser(refId, id) : addReferenceGroup(refId, id)),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(referenceQueryKeys.detail(refId));
            },
        },
    );
}

/**
 * Initializes a mutator for updating a reference members modifying rights
 *
 * @param noun - Whether the member is a user or a group
 * @returns A mutator for updating a reference members modifying rights
 */
export function useUpdateReferenceMember(noun: string) {
    return useMutation<
        ReferenceUser | ReferenceGroup,
        unknown,
        { refId: string; id: string | number; update: { [key: string]: boolean } }
    >(({ refId, id, update }) =>
        noun === "user" ? editReferenceUser(refId, id, update) : editReferenceGroup(refId, id, update),
    );
}

/**
 * Initializes a mutator for removing members from a reference
 *
 * @param refId - The reference to remove the member from
 * @param noun - Whether the member is a user or a group
 * @returns A mutator for removing members from a reference
 */
export function useRemoveReferenceUser(refId: string, noun: string) {
    const queryClient = useQueryClient();

    return useMutation<Response, unknown, { id: string | number }>(
        ({ id }) => (noun === "user" ? removeReferenceUser(refId, id) : removeReferenceGroup(refId, id)),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(referenceQueryKeys.detail(refId));
            },
        },
    );
}

/**
 * Get a reference by its id
 *
 * @param refId - The id of the reference to get
 * @returns Query results containing the reference
 */
export function useGetReference(refId: string) {
    return useQuery<Reference>(referenceQueryKeys.detail(refId), () => getReference(refId));
}

/**
 * Checks if an update is available for a remote reference
 *
 * @param refId - The unique identifier of the reference
 */
export function useCheckReferenceUpdates(refId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => checkRemoteReferenceUpdates(refId),
        onSuccess: () => {
            queryClient.invalidateQueries(referenceQueryKeys.detail(refId));
        },
    });
}

/**
 * Update a reference from a remote source
 *
 * @param refId - The unique identifier of the reference
 */
export function useUpdateRemoteReference(refId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => updateRemoteReference(refId),
        onSuccess: () => {
            queryClient.invalidateQueries(referenceQueryKeys.detail(refId));
        },
    });
}
