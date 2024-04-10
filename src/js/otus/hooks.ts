import { useFetchOTU } from "@otus/queries";
import { OTUIsolate } from "@otus/types";
import { indexOf, map, sortBy } from "lodash-es/lodash";

type SequencesResponse = {
    data: OTUIsolate;
    isLoading: boolean;
};

/**
 * A hook for sorting the sequences for the active isolate
 *
 * @param otuId - The otu which the isolate belongs to
 * @param isolate - The active isolate
 */
export default function useGetSequences(otuId: string, isolate: OTUIsolate): SequencesResponse {
    const { data, isLoading } = useFetchOTU(otuId);

    if (isLoading) {
        return { data: data, isLoading: isLoading };
    }

    const { sequences } = isolate;

    if (sequences) {
        const segmentNames = map(data.schema, "name");
        const updatedSequences = sortBy(sequences, [
            entry => {
                const index = indexOf(segmentNames, entry.segment);
                return index !== -1 ? index : segmentNames.length;
            },
        ]);

        return { data: { ...isolate, sequences: updatedSequences }, isLoading: isLoading };
    }

    return { data: { ...isolate, sequences: [] }, isLoading: isLoading };
}
