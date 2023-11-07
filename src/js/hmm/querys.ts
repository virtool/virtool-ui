import { useQuery } from "react-query";
import { Request } from "../app/request";

export function findHmms() {
    return Request.get("/hmms").then(res => res.body);
}

export function useFindHmms() {
    return useQuery("hmms", findHmms);
}
