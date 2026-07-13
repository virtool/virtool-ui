import { apiClient } from "@app/api";
import { getUploads } from "@server/uploads/functions";
import {
	keepPreviousData,
	queryOptions,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { fileQueryKeys } from "@uploads/keys";
import type { ErrorResponse } from "@/types/api";
import type { FileResponse, UploadType } from "./types";

/**
 * The uploads with the given ids, for a view that is handed ids rather than a
 * list — a URL naming its read files, say.
 *
 * Uploads that have been removed, or reserved by another sample, are absent
 * from the result rather than erroring: they are no longer selectable, and the
 * caller is expected to tell the user which of the ids it asked for went
 * missing.
 *
 * @param type - the type of upload the ids must name
 * @param ids - the ids to look up
 */
export function uploadsQueryOptions(type: UploadType, ids: number[]) {
	return queryOptions({
		queryKey: fileQueryKeys.selection(type, ids),
		queryFn: () => getUploads({ data: { ids, type } }),
	});
}

/**
 * Fetch the uploads with the given ids.
 *
 * @param type - the type of upload the ids must name
 * @param ids - the ids to look up
 */
export function useFetchUploads(type: UploadType, ids: number[]) {
	return useQuery(uploadsQueryOptions(type, ids));
}

function findFiles(
	type: UploadType,
	page: number,
	per_page: number,
	term?: string,
): Promise<FileResponse> {
	return apiClient
		.get("/uploads")
		.query({
			upload_type: type,
			page,
			per_page,
			ready: true,
			paginate: true,
			find: term,
		})
		.then((res) => res.body);
}

export function useListFiles(type: UploadType, page, per_page: number) {
	return useQuery<FileResponse, ErrorResponse>({
		queryKey: fileQueryKeys.list([type, page, per_page]),
		queryFn: () => findFiles(type, page, per_page),
		placeholderData: keepPreviousData,
	});
}

export function useInfiniteFindFiles(
	type: UploadType,
	per_page: number,
	term?: string,
) {
	return useInfiniteQuery<FileResponse>({
		queryKey: fileQueryKeys.infiniteList([type, per_page]),
		queryFn: ({ pageParam }) =>
			findFiles(type, pageParam as number, per_page, term),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.page >= lastPage.page_count) {
				return undefined;
			}
			return (lastPage.page || 1) + 1;
		},
	});
}

/**
 * Initializes a mutator for deleting a file
 *
 * @returns A mutator for deleting a file
 */
export function useDeleteFile() {
	return useMutation<null, unknown, { id: number }>({
		mutationFn: ({ id }) =>
			apiClient.delete(`/uploads/${id}`).then((res) => res.body),
	});
}

/**
 * Initializes a mutator for deleting several files at once
 *
 * @returns A mutator for deleting several files
 */
export function useDeleteFiles() {
	const queryClient = useQueryClient();

	return useMutation<void, ErrorResponse, { ids: number[] }>({
		mutationFn: async ({ ids }) => {
			await Promise.all(ids.map((id) => apiClient.delete(`/uploads/${id}`)));
		},
		// Settled, not success: a partial failure still removed some of the files,
		// so the list has to be refreshed either way.
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: fileQueryKeys.lists() });
		},
	});
}
