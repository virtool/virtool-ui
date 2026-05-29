import { apiClient } from "@app/api";
import { useMutation } from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";

/**
 * Initialize a mutator for executing developer commands
 *
 * @returns A mutator for executing developer commands
 */
export function usePostDevCommand() {
	return useMutation<unknown, ErrorResponse, { command: string }>({
		mutationFn: ({ command }) =>
			apiClient
				.post("/dev")
				.send({ command })
				.then((res) => res.body),
	});
}
