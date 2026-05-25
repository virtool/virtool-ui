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
import type { Message, MessageColor } from "./types";

/**
 * Factory for generating react-query keys for message related queries.
 */
export const messageQueryKeys = {
	all: () => ["message"] as const,
	lists: () => ["message", "list"] as const,
	active: () => ["message", "active"] as const,
};

/**
 * Fetch the active instance message (the one shown in the banner) from the API.
 */
export function useFetchMessage() {
	return useQuery<Message | null>({
		queryKey: messageQueryKeys.active(),
		queryFn: () => findMessage(),
	});
}

/**
 * Fetch the full list of instance messages. Admin-only.
 */
export function useFetchMessages() {
	return useQuery<Message[]>({
		queryKey: messageQueryKeys.lists(),
		queryFn: () => findMessages(),
	});
}

/**
 * Initialize a mutator for creating a new instance message.
 */
export function useCreateMessage() {
	const queryClient = useQueryClient();
	return useMutation<Message, Error, { message: string; color: MessageColor }>({
		mutationFn: ({ message, color }) =>
			createMessage({ data: { message, color } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for updating an existing instance message.
 */
export function useUpdateMessage() {
	const queryClient = useQueryClient();
	return useMutation<
		Message,
		Error,
		{ id: number; message?: string; color?: MessageColor }
	>({
		mutationFn: ({ id, message, color }) =>
			updateMessage({ data: { id, message, color } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for deleting an instance message.
 */
export function useDeleteMessage() {
	const queryClient = useQueryClient();
	return useMutation<null, Error, { id: number }>({
		mutationFn: ({ id }) => deleteMessage({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for activating a specific instance message. Deactivates
 * any currently active message in the same transaction.
 */
export function useSetActiveMessage() {
	const queryClient = useQueryClient();
	return useMutation<Message, Error, { id: number }>({
		mutationFn: ({ id }) => setActiveMessage({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}

/**
 * Initialize a mutator for clearing the active instance message.
 */
export function useClearActiveMessage() {
	const queryClient = useQueryClient();
	return useMutation<null, Error, void>({
		mutationFn: () => clearActiveMessage(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}
