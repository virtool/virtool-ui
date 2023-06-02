import { Request } from "../app/request";

export const find = ({ term, page }) => Request.get("/subtractions").query({ find: term, page });

export const shortlist = () => Request.get("/subtractions?short=true");

export const get = ({ subtractionId }) => Request.get(`/subtractions/${subtractionId}`);

export const create = ({ name, nickname, uploadId }) =>
    Request.post("/subtractions").send({
        name,
        nickname,
        upload_id: uploadId,
    });

export const edit = ({ subtractionId, name, nickname }) =>
    Request.patch(`/subtractions/${subtractionId}`).send({ name, nickname });

export const remove = ({ subtractionId }) => Request.delete(`/subtractions/${subtractionId}`);
