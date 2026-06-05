import { apiClient } from "@app/api";
import { useQuery } from "@tanstack/react-query";
import type { MLModelSearchResult } from "./types";

export const modelQueryKeys = {
	all: () => ["models"] as const,
	lists: () => ["models", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["models", "list", ...filters] as const,
	details: () => ["models", "detail"] as const,
	detail: (id: number) => ["models", "detail", id] as const,
};

export function useFindModels() {
	return useQuery<MLModelSearchResult>({
		queryKey: modelQueryKeys.list([]),
		queryFn: () => apiClient.get("/ml").then((response) => response.body),
	});
}
