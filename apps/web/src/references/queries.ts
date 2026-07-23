import { settingsQueryKeys } from "@administration/keys";
import type { Settings } from "@administration/types";
import { apiClient } from "@app/api";
import { referenceQueryKeys } from "@references/keys";
import { updateSettings } from "@server/settings/functions";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { postUpload } from "@uploads/uploader";
import { useState } from "react";
import type { ErrorResponse } from "@/types/api";
import type {
	Reference,
	ReferenceGroup,
	ReferenceMinimal,
	ReferenceSearchResult,
	ReferenceUser,
} from "./types";

/**
 * Adds a member (user or group) to a reference.
 *
 * Shared by the add/edit/remove member hooks, which all branch on whether the
 * member is a user or a group.
 */
function addReferenceUser(
	refId: string,
	userId: string | number,
): Promise<ReferenceUser> {
	return apiClient
		.post(`/refs/${refId}/users`)
		.send({ user_id: userId })
		.then((response) => response.body);
}

function addReferenceGroup(
	refId: string,
	groupId: string | number,
): Promise<ReferenceGroup> {
	return apiClient
		.post(`/refs/${refId}/groups`)
		.send({ group_id: groupId })
		.then((response) => response.body);
}

function editReferenceUser(
	refId: string,
	userId: string | number,
	update: { [key: string]: boolean },
) {
	return apiClient
		.patch(`/refs/${refId}/users/${userId}`)
		.send(update)
		.then((res) => res.body);
}

function editReferenceGroup(
	refId: string,
	groupId: string | number,
	update: { [key: string]: boolean },
) {
	return apiClient
		.patch(`/refs/${refId}/groups/${groupId}`)
		.send(update)
		.then((res) => res.body);
}

function removeReferenceUser(
	refId: string,
	userId: string | number,
): Promise<Response> {
	return apiClient
		.delete(`/refs/${refId}/users/${userId}`)
		.then((response) => response.body);
}

function removeReferenceGroup(
	refId: string,
	groupId: string | number,
): Promise<Response> {
	return apiClient
		.delete(`/refs/${refId}/groups/${groupId}`)
		.then((response) => response.body);
}

/**
 * Query options for a paginated list of references.
 *
 * @param page - The page to fetch
 * @param per_page - The number of references to fetch per page
 * @param term - The search term to filter references by
 * @param archived - Lifecycle filter; `true` for archived only, `false` for active only
 */
export function referencesQueryOptions(
	page: number,
	per_page: number,
	term: string,
	archived?: boolean,
) {
	return queryOptions<ReferenceSearchResult, ErrorResponse>({
		queryKey: referenceQueryKeys.list([page, per_page, term, archived]),
		queryFn: () =>
			apiClient
				.get("/refs")
				.query({ find: term, page, per_page, archived })
				.then((response) => {
					const { documents, ...rest } = response.body;
					return { ...rest, items: documents };
				}),
	});
}

/**
 * Fetch a paginated list of references, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`. Use this from components
 * rendered under the reference list route, whose loader prefetches the page —
 * loading and errors are handled by the route's Suspense and `errorComponent`
 * rather than inline.
 */
export function useSuspenseReferences(
	page: number,
	per_page: number,
	term: string,
	archived?: boolean,
) {
	return useSuspenseQuery(
		referencesQueryOptions(page, per_page, term, archived),
	);
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
		{ name: string; description: string; refId: number }
	>({
		mutationFn: ({ name, description, refId }) =>
			apiClient
				.post("/refs")
				.send({ name, description, clone_from: refId })
				.then((res) => res.body),
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
			importFrom: number;
		}
	>({
		mutationFn: ({ name, description, importFrom }) =>
			apiClient
				.post("/refs")
				.send({ name, description, import_from: importFrom })
				.then((res) => res.body),
	});
}

/**
 * Initializes a mutator for uploading a reference
 *
 * @returns The mutator, file information, and progress of the reference upload
 */
export function useUploadReference() {
	const [fileName, setFileName] = useState("");
	const [uploadId, setUploadId] = useState<number | null>(null);
	const [progress, setProgress] = useState(0);

	const uploadMutation = useMutation({
		mutationFn: (file: File) =>
			postUpload(file, file.name, "reference", ({ percent }) => {
				setProgress(percent);
			}).then((upload) => {
				setFileName(upload.name);
				setUploadId(upload.id);
			}),
		onMutate: () => {
			setFileName("");
			setUploadId(null);
			setProgress(0);
		},
	});

	return { uploadMutation, fileName, uploadId, progress };
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
			apiClient
				.post("/refs")
				.send({ name, description, data_type: "genome", organism })
				.then((response) => response.body),
	});
}

/**
 * Initializes a mutator for updating a reference
 *
 * @returns A mutator for updating a reference
 */
export function useUpdateReference(refId: string, onSuccess?: () => void) {
	const queryClient = useQueryClient();

	const mutation = useMutation<
		Reference,
		ErrorResponse,
		{
			name?: string;
			description?: string;
			organism?: string;
			restrict_source_types?: boolean;
		}
	>({
		mutationFn: (data) => {
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
 * Initializes a mutator for replacing a reference's allowed source types
 *
 * @param refId - The id of the reference to update
 * @returns A mutator that takes the complete new list of source types
 */
export function useUpdateReferenceSourceTypes(refId: string) {
	const queryClient = useQueryClient();

	return useMutation<Reference, ErrorResponse, string[]>({
		mutationFn: (sourceTypes) =>
			apiClient
				.patch(`/refs/${refId}`)
				.send({ source_types: sourceTypes })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: referenceQueryKeys.detail(refId),
			});
		},
	});
}

/**
 * Initializes a mutator for replacing the source types new references start with
 *
 * @returns A mutator that takes the complete new list of default source types
 */
export function useUpdateDefaultSourceTypes() {
	const queryClient = useQueryClient();

	return useMutation<Settings, ErrorResponse, string[]>({
		mutationFn: (sourceTypes) =>
			updateSettings({ data: { defaultSourceTypes: sourceTypes } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all() });
		},
	});
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

export function referenceQueryOptions(refId: string) {
	return queryOptions<Reference, ErrorResponse>({
		queryKey: referenceQueryKeys.detail(refId),
		queryFn: () =>
			apiClient.get(`/refs/${refId}`).then((response) => response.body),
	});
}

/**
 * Get a reference by its id
 *
 * @param refId - The id of the reference to get
 * @returns Query results containing the reference
 */
export function useFetchReference(refId: string) {
	return useQuery(referenceQueryOptions(refId));
}

/**
 * Fetch a reference, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary instead of resolving to `undefined`. Use this from components
 * rendered under the `$refId` detail route, whose loader prefetches the
 * reference — loading and errors are handled by the route's Suspense and
 * `errorComponent` rather than inline.
 */
export function useSuspenseReference(refId: string) {
	return useSuspenseQuery(referenceQueryOptions(refId));
}

/**
 * Initializes a mutator for archiving a reference
 *
 * @param refId - The id of the reference to archive
 * @returns A mutator for archiving the reference
 */
export function useArchiveReference(refId: string) {
	const queryClient = useQueryClient();

	return useMutation<Reference, ErrorResponse, void>({
		mutationFn: () =>
			apiClient
				.post(`/refs/${refId}/archive`)
				.then((response) => response.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: referenceQueryKeys.detail(refId),
			});
			queryClient.invalidateQueries({
				queryKey: referenceQueryKeys.lists(),
			});
		},
	});
}

/**
 * Initializes a mutator for unarchiving a reference
 *
 * @param refId - The id of the reference to unarchive
 * @returns A mutator for unarchiving the reference
 */
export function useUnarchiveReference(refId: string) {
	const queryClient = useQueryClient();

	return useMutation<Reference, ErrorResponse, void>({
		mutationFn: () =>
			apiClient
				.post(`/refs/${refId}/unarchive`)
				.then((response) => response.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: referenceQueryKeys.detail(refId),
			});
			queryClient.invalidateQueries({
				queryKey: referenceQueryKeys.lists(),
			});
		},
	});
}
