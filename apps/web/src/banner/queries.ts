import {
	clearActiveMessage,
	createMessage,
	deleteMessage,
	findMessage,
	findMessages,
	setActiveMessage,
	updateMessage,
} from "@server/messages/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Banner, BannerColor } from "./types";

/**
 * Factory for generating react-query keys for banner related queries.
 */
export const bannerQueryKeys = {
	all: () => ["banner"] as const,
	lists: () => ["banner", "list"] as const,
	active: () => ["banner", "active"] as const,
};

/**
 * Fetch the active banner from the API.
 */
export function useFetchBanner() {
	return useQuery<Banner | null>({
		queryKey: bannerQueryKeys.active(),
		queryFn: () => findMessage(),
	});
}

/**
 * Fetch the full list of banners. Admin-only.
 */
export function useFetchBanners() {
	return useQuery<Banner[]>({
		queryKey: bannerQueryKeys.lists(),
		queryFn: () => findMessages(),
	});
}

/**
 * Initialize a mutator for creating a new banner.
 */
export function useCreateBanner() {
	const queryClient = useQueryClient();
	return useMutation<Banner, Error, { message: string; color: BannerColor }>({
		mutationFn: ({ message, color }) =>
			createMessage({ data: { message, color } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for updating an existing banner.
 */
export function useUpdateBanner() {
	const queryClient = useQueryClient();
	return useMutation<
		Banner,
		Error,
		{ id: number; message?: string; color?: BannerColor }
	>({
		mutationFn: ({ id, message, color }) =>
			updateMessage({ data: { id, message, color } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for deleting a banner.
 */
export function useDeleteBanner() {
	const queryClient = useQueryClient();
	return useMutation<null, Error, { id: number }>({
		mutationFn: ({ id }) => deleteMessage({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for activating a specific banner. Deactivates any
 * currently active banner in the same transaction.
 */
export function useSetActiveBanner() {
	const queryClient = useQueryClient();
	return useMutation<Banner, Error, { id: number }>({
		mutationFn: ({ id }) => setActiveMessage({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for clearing the active banner.
 */
export function useClearActiveBanner() {
	const queryClient = useQueryClient();
	return useMutation<null, Error, void>({
		mutationFn: () => clearActiveMessage(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: bannerQueryKeys.all() });
		},
	});
}
