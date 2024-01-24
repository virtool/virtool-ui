import { Request } from "../app/request";
import { UserResponse } from "./types";

export function find({ term, page }) {
    return Request.get("/users").query({ find: term, page });
}

/**
 * Creates the first user
 *
 * @param handle - The handle of the user
 * @param password - The password of the user
 * @returns A promise resolving to creating the first user
 */
export function createFirst({ handle, password }) {
    return Request.put("/users/first").send({
        handle,
        password,
    });
}

/**
 * Fetch a page of users search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @returns A promise resolving to a page of user search results
 */
export function findUsers(page: number, per_page: number, term: string): Promise<UserResponse> {
    return Request.get("/admin/users")
        .query({ page, per_page, term })
        .then(res => res.body);
}
