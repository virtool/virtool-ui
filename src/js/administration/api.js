import { Request } from "../app/request";

export const get = () => Request.get("/settings");

export const update = ({ update }) => Request.patch("/settings").send(update);
