import { useQuery } from "@tanstack/react-query";
import { fetchLabels } from "./api";

export const labelQueryKeys = {
    all: () => ["label"] as const,
    lists: () => ["label", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["label", "list", "single", ...filters] as const,
};

export function useFetchLabels() {
    return useQuery(labelQueryKeys.list([]), fetchLabels);
}
