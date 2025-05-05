import { apiClient } from "../app/api";
import {
    Group,
    GroupMinimal,
    GroupSearchResults,
    PermissionsUpdate,
} from "./types";

/**
 * Fetch a non-paginated list of groups or page of group search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of groups to fetch per page
 * @param term - The search term to filter groups by
 * @param paginate - Whether the results are paginated
 * @returns A promise resolving to a page of group search results
 */
export function findGroups(
    page?: number,
    per_page?: number,
    term?: string,
    paginate?: boolean,
): Promise<GroupSearchResults | GroupMinimal[]> {
    return apiClient
        .get("/groups")
        .query({ page, per_page, term, paginate })
        .then((response) => response.body);
}

export function getGroup(id) {
    return apiClient.get(`/groups/${id}`).then((response) => response.body);
}

export function updateGroup(
    id: string | number,
    name?: string,
    permissions?: PermissionsUpdate,
): Promise<Group> {
    return apiClient
        .patch(`/groups/${id}`)
        .send({ name, permissions })
        .then((res) => res.body);
}

export function removeGroup(id: string | number): Promise<null> {
    return apiClient.delete(`/groups/${id}`).then((res) => res.body);
}

export function createGroup(name: string): Promise<Group> {
    return apiClient
        .post("/groups")
        .send({
            name,
        })
        .then((res) => res.body);
}
