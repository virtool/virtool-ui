import { Root } from "@app/types";
import { apiClient } from "./apiClient";

/**
 * Get the root data information
 *
 * @returns The root data information
 */
export function rootData(): Promise<Root> {
    return apiClient.get("/").then((res) => res.body);
}
