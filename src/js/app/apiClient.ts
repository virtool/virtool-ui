import Superagent, { Request } from "superagent";

const agent = Superagent.agent();

function prefixRequestUrl(request: Request) {
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

export const apiClient = agent;
