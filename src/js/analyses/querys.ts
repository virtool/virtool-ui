import { useMutation } from "react-query";
import { remove } from "./api";

export function useRemoveAnalysis() {
    return useMutation(remove);
}
