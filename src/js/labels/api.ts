import { Request } from "../app/request";

export const listLabels = () => Request.get("/labels");

export const create = ({ name, description, color }) =>
    Request.post("/labels").send({
        name,
        description,
        color,
    });

export const remove = ({ labelId }) => Request.delete(`/labels/${labelId}`);

export const update = ({ labelId, name, description, color }) =>
    Request.patch(`/labels/${labelId}`).send({
        name,
        description,
        color,
    });
