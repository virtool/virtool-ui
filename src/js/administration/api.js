import { Request } from "../app/request";

export function get() {
    return Request.get("/settings");
}

export function update({ update }) {
    return Request.patch("/settings").send(update);
}
