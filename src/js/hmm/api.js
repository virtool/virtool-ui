import { Request } from "../app/request";

export default {
    find: ({ term, page }) => Request.get("/hmms").query({ find: term, page }),
    list: ({ page }) => Request.get("/hmms").query({ page }),
    install: () => Request.post("/hmms/status/updates"),
    get: ({ hmmId }) => Request.get(`/hmms/${hmmId}`),
    purge: () => Request.delete("/hmms"),
};
