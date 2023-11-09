import { useQuery } from "react-query";
import { Request } from "../app/request";

function subtractionShortlist() {
    return Request.get("/subtractions?short=true").then(res => res.body);
}

export function useSubtractionsShortlist() {
    return useQuery("subtractionsShortlist", subtractionShortlist);
}
