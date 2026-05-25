import { findMessage, setMessage } from "@server/messages/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message, MessageColor } from "./types";

/**
 * Factory for generating react-query keys for message related queries.
 */
export const messageQueryKeys = {
	all: () => ["message"] as const,
};

/**
 * Fetch the instance message from the API
 *
 * @returns The instance message
 */
export function useFetchMessage() {
	return useQuery<Message | null>({
		queryKey: messageQueryKeys.all(),
		queryFn: () => findMessage(),
	});
}

/**
 * Initializes a mutator for updating the instance message
 *
 * @returns A mutator for updating the instance message
 */
export function useSetMessage() {
	const queryClient = useQueryClient();
	return useMutation<
		Message,
		unknown,
		{ message: string; color: MessageColor }
	>({
		mutationFn: ({ message, color }) =>
			setMessage({ data: { message, color } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: messageQueryKeys.all() });
		},
	});
}
