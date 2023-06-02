import { forEach } from "lodash-es";
import { Request } from "../app/request";

export const find = ({ archived, states, page }) => {
    const request = Request.get("/jobs").query({ archived, page });
    forEach(states, state => request.query({ state }));
    return request;
};

export const get = ({ jobId }) => Request.get(`/jobs/${jobId}`);
export const cancel = ({ jobId }) => Request.put(`/jobs/${jobId}/cancel`);
export const archive = ({ jobId }) => Request.patch(`/jobs/${jobId}/archive`);
