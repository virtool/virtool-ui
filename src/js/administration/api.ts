/**
 * Functions for requesting data required for managing virtool.
 *
 * @module account/api
 */
import { Response } from "superagent";
import { Request } from "../app/request";
import { User, UserResponse } from "../users/types";
import { AdministratorRoles, Settings } from "./types";

/**
 * Fetch the current settings from the server.
 *
 * @returns - A promise resolving to the current server settings.
 */
export function fetchSettings(): Promise<Settings> {
    return Request.get("/settings").then(response => {
        return response.body;
    });
}

/**
 * Fetch the current settings from the server.
 *
 * @returns - A promise resolving to the complete response, including the servers settings.
 */
export function legacyFetchSettings(): Promise<Response> {
    return Request.get("/settings");
}

export type SettingsUpdate = {
    default_source_types?: string[];
    enable_api?: boolean;
    enable_sentry?: boolean;
    hmm_slug?: string;
    minimum_password_length?: number;
    sample_all_read?: boolean;
    sample_all_write?: boolean;
    sample_group?: string;
    sample_group_read?: boolean;
    sample_group_write?: boolean;
    sample_unique_names?: boolean;
};

/**
 * Update the current settings on the server.
 *
 * @returns - A promise resolving to the complete response containing the updated settings.
 */
export function updateSettings(update: SettingsUpdate): Promise<Settings> {
    return Request.patch("/settings")
        .send(update)
        .then(response => response.body);
}

/**
 * Fetch a list of valid administrator roles
 *
 * @returns - A promise resolving to the list of known administrator roles
 */
export function fetchAdministratorRoles(): Promise<AdministratorRoles[]> {
    return Request.get("/admin/roles").then(response => response.body);
}

/**
 * Fetch a page of users search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - Filter the users by administrator status
 * @param active - Filter the users by whether they are active
 * @returns A promise resolving to a page of user search results
 */
export function findUsers(
    page: number,
    per_page: number,
    term: string,
    administrator: boolean,
    active: boolean
): Promise<UserResponse> {
    return Request.get("/admin/users")
        .query({ page, per_page, term, administrator, active })
        .then(response => {
            return response.body;
        });
}

/**
 * Fetch a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A promise resolving to a single user
 */
export function getUser(userId: string): Promise<User> {
    return Request.get(`/admin/users/${userId}`).then(res => res.body);
}

/**
 * Creates a user
 *
 * @param handle - The users username or handle
 * @param password - The users password
 * @param forceReset - Whether the user will be forced to reset their password on next login
 * @returns A promise resolving to creating a user
 */
export function createUser({ handle, password, forceReset }): Promise<User> {
    return Request.post("/admin/users")
        .send({
            handle,
            password,
            force_reset: forceReset,
        })
        .then(res => res.body);
}

export type UserUpdate = {
    active?: boolean;
    force_reset?: boolean;
    password?: string;
    primary_group?: string;
    groups?: string[];
};

/**
 * Updates the data for the user
 *
 * @param userId - The user to be updated
 * @param update - The update to apply to the user
 * @returns A promise resolving to a response containing the updated user's data
 */
export function updateUser(userId: string, update: UserUpdate): Promise<User> {
    return Request.patch(`/admin/users/${userId}`)
        .send(update)
        .then(res => res.body);
}

/**
 * Update the administrator role of a user
 *
 * @param role - The AdministratorRole to assign the user
 * @param user_id - The id of the user to update
 * @returns A promise resolving to the complete response containing the updated user
 */
export function setAdministratorRole(role: string, user_id: string): Promise<Response> {
    return Request.put(`/admin/users/${user_id}/role`).send({ role });
}
