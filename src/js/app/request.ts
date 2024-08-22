import Superagent, { SuperAgentRequest } from "superagent";

type HttpMethod = "get" | "post" | "patch" | "put" | "delete";

type CreateRequest = (method: HttpMethod) => (slug: string) => SuperAgentRequest;

/** A helper function to create a Superagent request with the specified HTTP method */
const createRequest: CreateRequest = method => slug => {
    return Superagent[method](`/api${slug}`).set("Accept", "application/json");
};

/** An object containing HTTP methods for sending requests to the API */
export const Request = {
    get: createRequest("get"),
    post: createRequest("post"),
    patch: createRequest("patch"),
    put: createRequest("put"),
    delete: createRequest("delete"),
};
