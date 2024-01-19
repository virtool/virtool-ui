import { Request } from "../app/request";

export const shortlist = () => Request.get("/subtractions?short=true");

export function createSubtraction(name, nickname, uploadId) {
    return Request.post("/subtractions")
        .send({
            name,
            nickname,
            upload_id: uploadId,
        })
        .then(response => response.body);
}

export function findSubtractions({ page, per_page, term }) {
    return Request.get("/subtractions")
        .query({ page, per_page, find: term })
        .then(response => {
            return response.body;
        });
}

export function getSubtraction(subtractionId) {
    return Request.get(`/subtractions/${subtractionId}`).then(res => res.body);
}

export function updateSubtraction(subtractionId, name, nickname) {
    return Request.patch(`/subtractions/${subtractionId}`).send({ name, nickname });
}

export function removeSubtraction(subtractionId) {
    return Request.delete(`/subtractions/${subtractionId}`).then(response => response.body);
}

export function fetchSubtractionShortlist() {
    return Request.get("/subtractions?short=true").then(res => res.body);
}
