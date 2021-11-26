import Superagent from "superagent";

const createRequest = method => url => {
    return Superagent[method](url).set("Accept", "application/json");
};

export const Request = {
    get: createRequest("get"),
    post: createRequest("post"),
    patch: createRequest("patch"),
    put: createRequest("put"),
    delete: createRequest("delete")
};
