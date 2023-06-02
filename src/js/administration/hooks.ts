import { useQuery } from "react-query";
import { Request } from "../app/request";

function fetchSettings() {
    return Request.get("/settings").then(response => {
        return response.body;
    });
}

export function useFetchSettings() {
    return useQuery("settings", fetchSettings);
}
