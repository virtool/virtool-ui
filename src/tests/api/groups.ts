import { Group } from "@groups/types";
import nock from "nock";

/**
 * Creates a mocked API call for getting a group.
 *
 * @param group group to be returned from the mocked API call
 * @returns nock scope for the mocked API call
 */
export function mockApiGetGroup(group: Group) {
    return nock("http://localhost")
        .get(`/api/groups/${group.id}`)
        .reply(200, group);
}

/**
 * Creates a mocked API call for getting a list of groups.
 *
 * @param groups groups to be returned from the mocked API call
 * @returns nock scope for the mocked API call
 */
export function mockApiListGroups(groups: Group[]) {
    return nock("http://localhost").get("/api/groups").reply(200, groups);
}
