import { postDevCommand } from "@/dev/api";
import { ErrorResponse } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

/**
 * Initialize a mutator for executing developer commands
 *
 * @returns A mutator for executing developer commands
 */
export function usePostDevCommand() {
    return useMutation<unknown, ErrorResponse, { command: string }>({
        mutationFn: ({ command }) => postDevCommand(command),
    });
}
