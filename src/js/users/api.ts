import { Request } from "../app/request";

export function find({ term, page }) {
    return Request.get("/users").query({ find: term, page });
}

export function createFirst({ handle, password }) {
    return Request.put("/users/first").send({
        handle,
        password,
    });
}
