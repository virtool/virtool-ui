import { apiClient } from "@app/api";
import type { Root } from "@app/types";

export function fetchRoot(): Promise<Root> {
	return apiClient.get("/").then((res) => res.body);
}
