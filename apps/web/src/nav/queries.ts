import { apiClient } from "@app/api";
import type { Root } from "@app/types";
import { useQuery } from "@tanstack/react-query";
import { rootQueryKeys } from "@wall/keys";

import type { ErrorResponse } from "@/types/api";

/**
 * Initializes a query for fetching the root document.
 *
 * Lives here rather than in `@wall/queries` because the wall never reads the
 * root document — the About dialog does. Keeping it there made `LoginWall`,
 * which imports that module for its login and reset mutations, drag `@app/api`
 * and superagent onto the unauthenticated `/login` first paint for a hook
 * `/login` never calls.
 *
 * @returns A query for fetching the root document
 */
export function useRootQuery() {
	return useQuery<Root, ErrorResponse>({
		queryKey: rootQueryKeys.all(),
		queryFn: () => apiClient.get("/").then((res) => res.body),
	});
}
