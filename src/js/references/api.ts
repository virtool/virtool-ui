import { Request } from "@app/request";
import {
    Reference,
    ReferenceGroup,
    ReferenceMinimal,
    ReferenceSearchResult,
    ReferenceUser,
} from "./types";

export function get({ refId }) {
    return Request.get(`/refs/${refId}`);
}

/**
 * Creates a clone of a reference
 *
 * @param name - The clone's given name
 * @param description - The clone's given description
 * @param refId - The id of the original reference
 * @returns A promise resolving to a clone of a reference
 */
export function cloneReference({
    name,
    description,
    refId,
}): Promise<ReferenceMinimal> {
    return Request.post("/refs")
        .send({
            name,
            description,
            clone_from: refId,
        })
        .then((res) => res.body);
}

/**
 * Remotely installs a reference from the Virtool repository
 *
 * @param remote_from - The repository address
 * @returns A promise resolving to the installing remote reference
 */
export function remoteReference(remote_from: string): Promise<Reference> {
    return Request.post("/refs")
        .send({ remote_from })
        .then((res) => res.body);
}

/**
 * Fetch a page of references search results
 *
 * @param term - The search term to filter references by
 * @param page - The page to fetch
 * @param per_page - The number of references to fetch per page
 * @returns A promise resolving to a page of references search results
 */
export function findReferences({
    term,
    page,
    per_page,
}): Promise<ReferenceSearchResult> {
    return Request.get("/refs")
        .query({ find: term, page, per_page })
        .then((response) => response.body);
}

/**
 * Fetches a single refernce
 *
 * @param refId - The id of the reference to fetch
 * @returns A promise resolving to a single reference
 */
export function getReference(refId: string): Promise<Reference> {
    return Request.get(`/refs/${refId}`).then((response) => response.body);
}

/**
 * Create an empty reference
 *
 * @param name - The name of the reference
 * @param description - The description of the reference
 * @param organism - The organism of the reference
 * @returns A promise resolving to creating an empty reference
 */
export function createReference(
    name: string,
    description: string,
    organism: string,
): Promise<Reference> {
    return Request.post("/refs")
        .send({
            name,
            description,
            data_type: "genome",
            organism,
        })
        .then((response) => response.body);
}

/**
 * Make the API call to import a reference.
 *
 * @param name - name of the reference
 * @param description - description for the reference
 * @param importFrom - the ID of the file to import from
 * @returns A promise resolving to importing a reference
 */
export function importReference(
    name: string,
    description: string,
    importFrom: string,
) {
    return Request.post("/refs")
        .send({
            name,
            description,
            import_from: importFrom,
        })
        .then((res) => res.body);
}

/**
 * Remove a reference
 *
 * @param refId - The id of the reference to remove
 * @returns A promise resolving to the removal of a reference
 */
export function removeReference(refId: string): Promise<null> {
    return Request.delete(`/refs/${refId}`).then((res) => res.body);
}

/**
 * Adds a user to a reference
 *
 * @param refId - The reference to have the user added to
 * @param userId - The user to add
 * @returns A promise resolving to adding a user to a reference
 */
export function addReferenceUser(
    refId: string,
    userId: string | number,
): Promise<ReferenceUser> {
    return Request.post(`/refs/${refId}/users`)
        .send({ user_id: userId })
        .then((response) => response.body);
}

/**
 * Adds a group to a reference
 *
 * @param refId - The reference to have the group added to
 * @param groupId - The group to add
 * @returns A promise resolving to adding a group to a reference
 */
export function addReferenceGroup(
    refId: string,
    groupId: string | number,
): Promise<ReferenceGroup> {
    return Request.post(`/refs/${refId}/groups`)
        .send({ group_id: groupId })
        .then((response) => response.body);
}

/**
 * Updates the modifying rights for a reference user
 *
 * @param refId - The id of the reference which the user is associated with
 * @param userId - The id of the user to be updated
 * @param update - The update to be applied
 * @returns A promise resolving to updating the reference user
 */
export function editReferenceUser(
    refId: string,
    userId: string | number,
    update: { [key: string]: boolean },
) {
    return Request.patch(`/refs/${refId}/users/${userId}`)
        .send(update)
        .then((res) => res.body);
}

/**
 * Updates the modifying rights for a reference group
 *
 * @param refId - The id of the reference which the group is associated with
 * @param groupId - The id of the group to be updated
 * @param update - The update to be applied
 * @returns A promise resolving to updating the reference group
 */
export function editReferenceGroup(
    refId: string,
    groupId: string | number,
    update: { [key: string]: boolean },
) {
    return Request.patch(`/refs/${refId}/groups/${groupId}`)
        .send(update)
        .then((res) => res.body);
}

/**
 * Removes user from a reference
 *
 * @param refId - The reference to have the user removed from
 * @param userId - The user to remove
 * @returns A promise resolving to the API response indicating if the removal was successful
 */
export function removeReferenceUser(
    refId: string,
    userId: string | number,
): Promise<Response> {
    return Request.delete(`/refs/${refId}/users/${userId}`).then(
        (response) => response.body,
    );
}

/**
 * Removes group from a reference
 *
 * @param refId - The reference to have the group removed from
 * @param groupId - The group to remove
 * @returns  A promise resolving to the API response indicating if the removal was successful
 */
export function removeReferenceGroup(
    refId: string,
    groupId: string | number,
): Promise<Response> {
    return Request.delete(`/refs/${refId}/groups/${groupId}`).then(
        (response) => response.body,
    );
}

/**
 * Checks for updates to a remote reference
 *
 * @param refId - The unique identifier of the reference
 */
export function checkRemoteReferenceUpdates(refId: string) {
    return Request.get(`/refs/${refId}/release`).then(
        (response) => response.body,
    );
}

/**
 * Request that the reference is updated from the remote source
 *
 * @param refId - The unique identifier of the reference
 */
export function updateRemoteReference(refId: string) {
    return Request.post(`/refs/${refId}/updates`)
        .send({})
        .then((response) => response.body);
}
