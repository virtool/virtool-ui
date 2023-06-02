import { Request } from "../app/request";

export const post = ({ command }) => Request.post(`/dev`).send({ command });
