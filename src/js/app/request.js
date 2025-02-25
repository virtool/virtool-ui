import Superagent from "superagent";

function createRequest(method) {
    return (slug) =>
        Superagent[method](`/api${slug}`).set("Accept", "application/json");
}

export const Request = {
    get: createRequest("get"),
    post: createRequest("post"),
    patch: createRequest("patch"),
    put: createRequest("put"),
    delete: createRequest("delete"),
};
