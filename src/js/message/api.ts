import { Request } from "../app/request";

export const get = () => Request.get("/instance_message");

export const set = ({ message }) => Request.put("/instance_message").send({ color: "red", message });
