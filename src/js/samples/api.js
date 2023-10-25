import { Request } from "../app/request";

export const find = ({ term, labels, workflows, page = 1 }) => {
    const request = Request.get("/samples").query({
        page,
    });

    if (term) {
        request.query({ find: term });
    }

    if (workflows) {
        request.query({ workflows });
    }

    if (labels) {
        labels.forEach(label => request.query({ label }));
    }

    request.sortQuery();

    return request;
};

export const filter = ({ term }) => Request.get(`/samples?find=${term}`);

export const get = ({ sampleId }) => Request.get(`/samples/${sampleId}`);

export const create = action => {
    const { name, isolate, host, locale, libraryType, subtractions, files, labels, group } = action;
    return Request.post("/samples").send({
        name,
        isolate,
        host,
        locale,
        subtractions,
        files,
        library_type: libraryType,
        labels,
        group,
    });
};

export const createSample = ({ name, isolate, host, locale, libraryType, subtractions, files, labels, group }) =>
    Request.post("/samples").send({
        name,
        isolate,
        host,
        locale,
        subtractions,
        files,
        library_type: libraryType,
        labels,
        group,
    });

export const update = ({ sampleId, update }) => Request.patch(`/samples/${sampleId}`).send(update);

export const updateRights = ({ sampleId, update }) => Request.patch(`/samples/${sampleId}/rights`).send(update);

export const remove = ({ sampleId }) => Request.delete(`/samples/${sampleId}`);
