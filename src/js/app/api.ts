import { Root } from "@app/types";
import { Request } from "./request";

/**
 * Get the root data information
 *
 * @returns The root data information
 */
export function rootData(): Promise<Root> {
    return Request.get("/").then((res) => res.body);
}
