import { Request } from "../app/request";

export const find = ({ refId, term, page }) => Request.get(`/api/refs/${refId}/indexes`).query({ find: term, page });

export const get = ({ indexId }) => Request.get(`/api/indexes/${indexId}`);

export const listReady = () => Request.get("/api/indexes").query({ ready: true });

export const getUnbuilt = ({ refId }) => Request.get(`/api/refs/${refId}/history?unbuilt=true`);

export const create = ({ refId }) => Request.post(`/api/refs/${refId}/indexes`);

export const getHistory = ({ indexId, page = 1 }) => Request.get(`/api/indexes/${indexId}/history?page=${page}`);
