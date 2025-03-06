import Superagent from "superagent";

const agent = Superagent.agent();

function prefixRequestUrl(request) {
    if (request.url[0] !== "/") {
        request.url = `/${request.url}`;
    }

    if (!request.url.startsWith("/api")) {
        request.url = `/api${request.url}`;
    }

    return request;
}

agent.accept("application/json");
agent.use(prefixRequestUrl);

function createRequest(method) {
    return (slug) => agent[method](slug);
}

export const Request = {
    get: createRequest("get"),
    post: createRequest("post"),
    patch: createRequest("patch"),
    put: createRequest("put"),
    delete: createRequest("delete"),
};
