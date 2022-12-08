import { Request } from "../app/request";

export const list = () => Request.get("/api/groups");

export const create = ({ name }) => Request.post("/api/groups").send({ name });

export function setName({ groupId, name }) {
    return Request.patch(`/api/groups/${groupId}`).send({
        name
    });
}

export const setPermission = ({ groupId, permission, value }) =>
    Request.patch(`/api/groups/${groupId}`).send({
        permissions: {
            [permission]: value
        }
    });

export const remove = ({ groupId }) => Request.delete(`/api/groups/${groupId}`);

export const get = ({ groupId }) => Request.get(`/api/groups/${groupId}`);
