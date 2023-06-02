import { Request } from "../app/request";

export const find = ({ term, page }) => Request.get("/hmms").query({ find: term, page });

export const list = ({ page }) => Request.get("/hmms").query({ page });

export const install = () => Request.post("/hmms/status/updates");

export const get = ({ hmmId }) => Request.get(`/hmms/${hmmId}`);

export const purge = () => Request.delete("/hmms");
