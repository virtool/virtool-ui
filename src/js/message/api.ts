import { Request } from "../app/request";

export const get = () => Request.get("/api/instance_message");

export const set = ({ message }) =>
    Request.put("/api/instance_message").send({ color: "red", message });
