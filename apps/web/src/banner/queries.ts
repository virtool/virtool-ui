import { createQueryKeys } from "@app/queryKeys";
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

const bannerKeys = createQueryKeys("banner");

/**
 * Query keys for banners.
 *
 * `active()` is the single banner shown to every user, which is a distinct
 * resource from the admin list rather than a member of it.
 */
export const bannerQueryKeys = {
	...bannerKeys,
	active: () => [...bannerKeys.all(), "active"] as const,
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
		mutationFn: async ({ id, message, color }) => {
			const banner = await updateMessage({ data: { id, message, color } });
			if (!banner) {
				throw new Error("Failed to update banner");
			}
			return banner;
		},
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
		mutationFn: async ({ id }) => {
			await deleteMessage({ data: { id } });
			return null;
		},
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
		mutationFn: async ({ id }) => {
			const banner = await setActiveMessage({ data: { id } });
			if (!banner) {
				throw new Error("Failed to activate banner");
			}
			return banner;
		},
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
