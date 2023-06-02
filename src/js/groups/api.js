import { Request } from "../app/request";

export const list = () => Request.get("/groups");

export const create = ({ name }) => Request.post("/groups").send({ name });

export function setName({ groupId, name }) {
    return Request.patch(`/groups/${groupId}`).send({
        name,
    });
}

export const setPermission = ({ groupId, permission, value }) =>
    Request.patch(`/groups/${groupId}`).send({
        permissions: {
            [permission]: value,
        },
    });

export const remove = ({ groupId }) => Request.delete(`/groups/${groupId}`);

export const get = ({ groupId }) => Request.get(`/groups/${groupId}`);
