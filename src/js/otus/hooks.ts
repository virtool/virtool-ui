import { useFetchOTU } from "@otus/queries";
import { OTUSequence } from "@otus/types";
import { indexOf, map, sortBy } from "lodash-es/lodash";

/**
 * A hook for sorting the sequences for the active isolate
 *
 * @param otuId - The otu which the isolate belongs to
 * @param sequences - The sequences in the active isolate
 */
export default function useGetSequences(otuId: string, sequences: OTUSequence) {
    const { data, isLoading } = useFetchOTU(otuId);

    if (isLoading) {
        return;
    }

    if (sequences) {
        const segmentNames = map(data.otu_schema, "name");

        return sortBy(sequences, [
            entry => {
                const index = indexOf(segmentNames, entry.segment);

                if (index !== -1) {
                    return index;
                }

                return segmentNames.length;
            },
        ]);
    }

    return [];
}
