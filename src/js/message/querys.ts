import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessage, setMessage } from "./api";
import { Message } from "./types";

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
    return useQuery<Message>(messageQueryKeys.all(), getMessage);
}

/**
 * Initializes a mutator for updating the instance message
 *
 * @returns A mutator for updating the instance message
 */
export function useSetMessage() {
    const queryClient = useQueryClient();
    return useMutation<Message, unknown, { message: string }>(({ message }) => setMessage(message), {
        onSuccess: () => {
            queryClient.invalidateQueries(messageQueryKeys.all());
        },
    });
}
