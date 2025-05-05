import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "../app/api";
import { ErrorResponse } from "../types/types";
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
    importReference,
    remoteReference,
    removeReference,
    removeReferenceGroup,
    removeReferenceUser,
    updateRemoteReference,
} from "./api";
import {
    Reference,
    ReferenceGroup,
    ReferenceInstalled,
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
    list: (filters: Array<string | number | boolean>) =>
        ["reference", "list", "single", ...filters] as const,
    details: () => ["reference", "detail"] as const,
    detail: (refId: string) => ["reference", "detail", refId] as const,
};

/**
 * Gets a paginated list of references
 *
 * @param page - The page to fetch
 * @param per_page - The number of references to fetch per page
 * @param term - The search term to filter references by
 * @returns The paginated list of references
 */
export function useFindReferences(
    page: number,
    per_page: number,
    term: string,
) {
    return useQuery<ReferenceSearchResult>({
        queryKey: referenceQueryKeys.list([page, per_page, term]),
        queryFn: () => findReferences({ page, per_page, term }),
        placeholderData: keepPreviousData,
    });
}

/**
 * Initializes a mutator for cloning a reference
 *
 * @returns A mutator for cloning a reference
 */
export function useCloneReference() {
    return useMutation<
        ReferenceMinimal,
        unknown,
        { name: string; description: string; refId: string }
    >({
        mutationFn: cloneReference,
    });
}

/**
 * Initializes a mutator for remotely installing a reference
 *
 * @returns A mutator for remotely installing a reference
 */
export function useRemoteReference() {
    const queryClient = useQueryClient();

    return useMutation<Reference, unknown, { remotes_from: string }>({
        mutationFn: ({ remotes_from }) => remoteReference(remotes_from),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: referenceQueryKeys.lists(),
            });
        },
    });
}

/**
 * Initializes a mutator for importing a reference
 *
 * @returns A mutator for importing a reference
 */
export function useImportReference() {
    return useMutation<
        unknown,
        unknown,
        {
            name: string;
            description: string;
            importFrom: string;
        }
    >({
        mutationFn: ({ name, description, importFrom }) =>
            importReference(name, description, importFrom),
    });
}

/**
 * Initializes a mutator for uploading a reference
 *
 * @returns The mutator, file information, and progress of the reference upload
 */
export function useUploadReference() {
    const [fileName, setFileName] = useState("");
    const [fileNameOnDisk, setFileNameOnDisk] = useState("");
    const [progress, setProgress] = useState(0);

    const uploadMutation = useMutation({
        mutationFn: (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            return apiClient
                .post("/uploads")
                .query({ name: file.name, type: "reference" })
                .send(formData)
                .on("progress", (event) => {
                    setProgress(event.percent);
                })
                .then((response) => {
                    setFileName(response.body.name);
                    setFileNameOnDisk(response.body.name_on_disk);
                });
        },
    });

    return { uploadMutation, fileName, fileNameOnDisk, progress };
}

/**
 * Initializes a mutator for creating an empty reference
 *
 * @returns A mutator for creating an empty reference
 */
export function useCreateReference() {
    return useMutation<
        Reference,
        unknown,
        {
            name: string;
            description: string;
            organism: string;
        }
    >({
        mutationFn: ({ name, description, organism }) =>
            createReference(name, description, organism),
    });
}

/**
 * Initializes a mutator for removing a reference
 *
 * @returns A mutator for removing a reference
 */
export function useRemoveReference() {
    return useMutation<null, unknown, { refId: string }>({
        mutationFn: ({ refId }) => removeReference(refId),
    });
}

/**
 * Initializes a mutator for updating a reference
 *
 * @returns A mutator for updating a reference
 */
export function useUpdateReference(refId: string, onSuccess?: () => void) {
    const queryClient = useQueryClient();

    const mutation = useMutation<Reference, ErrorResponse, unknown>({
        mutationFn: (data: {
            restrict_source_types?: boolean;
            targets?: ReferenceTarget[];
        }) => {
            return apiClient
                .patch(`/refs/${refId}`)
                .send(data)
                .then((res) => res.body);
        },
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: referenceQueryKeys.detail(refId),
                })
                .then(() => onSuccess?.());
        },
    });

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

    return useMutation<
        ReferenceUser | ReferenceGroup,
        unknown,
        { id: string | number }
    >({
        mutationFn: ({ id }) =>
            noun === "user"
                ? addReferenceUser(refId, id)
                : addReferenceGroup(refId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: referenceQueryKeys.detail(refId),
            });
        },
    });
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
        {
            refId: string;
            id: string | number;
            update: { [key: string]: boolean };
        }
    >({
        mutationFn: ({ refId, id, update }) =>
            noun === "user"
                ? editReferenceUser(refId, id, update)
                : editReferenceGroup(refId, id, update),
    });
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

    return useMutation<Response, unknown, { id: string | number }>({
        mutationFn: ({ id }) =>
            noun === "user"
                ? removeReferenceUser(refId, id)
                : removeReferenceGroup(refId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: referenceQueryKeys.detail(refId),
            });
        },
    });
}

/**
 * Get a reference by its id
 *
 * @param refId - The id of the reference to get
 * @returns Query results containing the reference
 */
export function useGetReference(refId: string) {
    return useQuery<Reference>({
        queryKey: referenceQueryKeys.detail(refId),
        queryFn: () => getReference(refId),
    });
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
            queryClient.invalidateQueries({
                queryKey: referenceQueryKeys.detail(refId),
            });
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
    return useMutation<ReferenceInstalled, ErrorResponse>({
        mutationFn: () => updateRemoteReference(refId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: referenceQueryKeys.detail(refId),
            });
        },
    });
}
