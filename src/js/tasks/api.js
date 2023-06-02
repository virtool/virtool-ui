import { Request } from "../app/request";

export const list = () => Request.get("/tasks");

export const get = ({ taskId }) => Request.get(`/tasks/${taskId}`);
