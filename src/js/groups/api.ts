import { Request } from "../app/request";
import { GroupUpdate } from "./types";

export const list = () => Request.get("/groups");

export function listGroups() {
    return Request.get("/groups").then(response => response.body);
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
