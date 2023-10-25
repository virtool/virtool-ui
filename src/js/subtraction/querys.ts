import { useQuery } from "react-query";
import { shortlist } from "./api";

export function useSubtractionsShortlist() {
    return useQuery("subtractionsShortlist", shortlist);
}
