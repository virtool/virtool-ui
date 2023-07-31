import { Request } from "../app/request";
/**
 * Fetch the current settings from the server.
 *
 * @returns - A promise resolving to the current server settings.
 */
export function fetchSettings() {
    return Request.get("/settings").then(response => {
        return response.body;
    });
}

/**
 * Fetch the current settings from the server.
 *
 * @returns - A promise resolving to the complete response, including the servers settings.
 */
export function legacyFetchSettings() {
    return Request.get("/settings");
}

/**
 * Update the current settings on the server.
 *
 * @returns - A promise resolving to the complete response containing the updated settings.
 */
export function updateSettings(update) {
    return Request.patch("/settings").send(update);
}

/**
 * Fetch a list of valid administrator roles
 *
 * @returns - A promise resolving to the list of valid administrator roles
 */
export function fetchAdministratorRoles() {
    return Request.get("/admin/roles").then(response => response.body);
}

/**
 * Fetch a page of users search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - Filter the users by administrator status
 * @returns A promise resolving to a page of user search results
 */
export function findUsers(page: number, per_page: number, term: string, administrator: boolean) {
    return Request.get("/admin/users")
        .query({ page, per_page, term, administrator })
        .then(response => {
            return response.body;
        });
}

/**
 * Update the administrator role of a user
 *
 * @param role - The AdministratorRole to assign the user
 * @param user_id - The id of the user to update
 * @returns A promise resolving to the complete response containing the updated user
 */
export function setAdministratorRole(role: string, user_id: string) {
    return Request.put(`/admin/users/${user_id}/role`).send({ role });
}
