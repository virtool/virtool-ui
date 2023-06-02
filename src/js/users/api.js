import { Request } from "../app/request";

export const find = ({ term, page }) => Request.get("/users").query({ find: term, page });

export const get = ({ userId }) => Request.get(`/users/${userId}`);

export const create = ({ handle, password, forceReset }) =>
    Request.post("/users").send({
        handle,
        password,
        force_reset: forceReset,
    });

export const createFirst = ({ handle, password }) =>
    Request.put("/users/first").send({
        handle,
        password,
    });

export const edit = ({ userId, update }) => Request.patch(`/users/${userId}`).send(update);
