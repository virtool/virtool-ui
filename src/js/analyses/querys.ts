import { useMutation } from "react-query";
import { remove } from "./api";

export function useRemoveAnalysis(id) {
    const mutation = useMutation(remove);

    const onRemove = analysisId => {
        mutation.mutate({ analysisId: id });
    };

    return onRemove;
}
