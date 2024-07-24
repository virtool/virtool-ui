import { Request } from "../app/request";
import { GroupMinimal, GroupSearchResults, GroupUpdate } from "./types";

export const list = () => Request.get("/groups");

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
    paginate?: boolean
): Promise<GroupSearchResults | GroupMinimal[]> {
    return Request.get("/groups")
        .query({ page, per_page, term, paginate })
        .then(response => response.body);
}

export function getGroup(id) {
    return Request.get(`/groups/${id}`).then(response => response.body);
}

export function updateGroup({ id, name, permissions }: GroupUpdate) {
    return Request.patch(`/groups/${id}`)
        .send({ name, permissions })
        .then(response => response.body);
}

export function removeGroup({ id }) {
    return Request.delete(`/groups/${id}`);
}

export function createGroup({ name }) {
    return Request.post("/groups")
        .send({
            name,
        })
        .then(response => response.body);
}
