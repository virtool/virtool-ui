import { Request } from "../app/request";

export const find = ({ refId, term, page }) => Request.get(`/refs/${refId}/indexes`).query({ find: term, page });

export const get = ({ indexId }) => Request.get(`/indexes/${indexId}`);

export const listReady = () => Request.get("/indexes").query({ ready: true });

export const getUnbuilt = ({ refId }) => Request.get(`/refs/${refId}/history?unbuilt=true`);

export const create = ({ refId }) => Request.post(`/refs/${refId}/indexes`);

export const getHistory = ({ indexId, page = 1 }) => Request.get(`/indexes/${indexId}/history?page=${page}`);
