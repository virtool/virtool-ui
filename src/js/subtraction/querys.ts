import { useQuery } from "react-query";
import { Request } from "../app/request";

function fetchSubtractions({ term, page }) {
    return Request.get("/subtractions")
        .query({ find: term, page })
        .then(response => {
            return response.body;
        });
}

export function useFetchSubtractions(term: string, page: number) {
    return useQuery("subtractions", () => fetchSubtractions({ term, page }));
}
