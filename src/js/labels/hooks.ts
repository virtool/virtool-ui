import { useQuery } from "react-query";
import { Request } from "../app/request";

function fetchLabels() {
    return Request.get("/api/labels").then(response => {
        return response.body;
    });
}

export function useFetchLabels() {
    return useQuery("labels", fetchLabels);
}
