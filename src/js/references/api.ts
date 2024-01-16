import { Request } from "../app/request";
import { Reference, ReferenceDataType, ReferenceMinimal, ReferenceSearchResult } from "./types";

export function find({ term, page }) {
    return Request.get("/refs").query({ find: term, page });
}

export function get({ refId }) {
    return Request.get(`/refs/${refId}`);
}

export function create({ name, description, dataType, organism }) {
    return Request.post("/refs").send({
        name,
        description,
        data_type: dataType,
        organism,
    });
}

export function edit({ refId, update }) {
    return Request.patch(`/refs/${refId}`).send(update);
}

export function importReference({ name, description, fileId }) {
    return Request.post("/refs").send({
        name,
        description,
        import_from: fileId,
    });
}

/**
 * Creates a clone of a reference
 *
 * @param name - The clone's given name
 * @param description - The clone's given description
 * @param refId - The id of the original reference
 * @returns A promise resolving to a clone of a reference
 */
export function cloneReference({ name, description, refId }): Promise<ReferenceMinimal> {
    return Request.post("/refs")
        .send({
            name,
            description,
            clone_from: refId,
        })
        .then(res => res.body);
}

export function remoteReference({ remote_from }) {
    return Request.post("/refs").send({ remote_from });
}

export function remove({ refId }) {
    return Request.delete(`/refs/${refId}`);
}

export function addUser({ refId, user }) {
    return Request.post(`/refs/${refId}/users`).send({ user_id: user });
}

export function editUser({ refId, userId, update }) {
    return Request.patch(`/refs/${refId}/users/${userId}`).send(update);
}

export function removeUser({ refId, userId }) {
    return Request.delete(`/refs/${refId}/users/${userId}`);
}

export function addGroup({ refId, group }) {
    return Request.post(`/refs/${refId}/groups`).send({ group_id: group });
}

export function editGroup({ refId, groupId, update }) {
    return Request.patch(`/refs/${refId}/groups/${groupId}`).send(update);
}

export function removeGroup({ refId, groupId }) {
    return Request.delete(`/refs/${refId}/groups/${groupId}`);
}

export function checkUpdates({ refId }) {
    return Request.get(`/refs/${refId}/release`);
}

export function updateRemote({ refId }) {
    return Request.post(`/refs/${refId}/updates`).send({});
}

/**
 * Fetch a page of references search results
 *
 * @param term - The search term to filter references by
 * @param page - The page to fetch
 * @param per_page - The number of references to fetch per page
 * @returns A promise resolving to a page of references search results
 */
export function findReferences({ term, page, per_page }): Promise<ReferenceSearchResult> {
    return Request.get("/refs")
        .query({ find: term, page, per_page })
        .then(response => response.body);
}

/**
 * Fetches a single refernce
 *
 * @param refId - The id of the reference to fetch
 * @returns A promise resolving to a single reference
 */
export function getReference(refId: string): Promise<Reference> {
    return Request.get(`/refs/${refId}`).then(response => response.body);
}

/**
 * Create an empty reference
 *
 * @param name - The name of the reference
 * @param description - The description of the reference
 * @param dataType - The reference data type
 * @param organism - The organism of the reference
 * @returns A promise resolving to creating an empty reference
 */
export function createReference(
    name: string,
    description: string,
    dataType: ReferenceDataType,
    organism: string,
): Promise<Reference> {
    return Request.post("/refs")
        .send({
            name,
            description,
            data_type: dataType,
            organism,
        })
        .then(response => response.body);
}

/**
 * Removes user from a reference
 *
 * @param refId - The reference to have the user removed from
 * @param userId - The user to remove
 * @returns A promise resolving to the API response indicating if the removal was successful
 */
export function removeReferenceUser(refId: string, userId: string | number): Promise<Response> {
    return Request.delete(`/refs/${refId}/users/${userId}`).then(response => response.body);
}

/**
 * Removes group from a reference
 *
 * @param refId - The reference to have the group removed from
 * @param groupId - The group to remove
 * @returns  A promise resolving to the API response indicating if the removal was successful
 */
export function removeReferenceGroup(refId: string, groupId: string | number): Promise<Response> {
    return Request.delete(`/refs/${refId}/groups/${groupId}`).then(response => response.body);
}
