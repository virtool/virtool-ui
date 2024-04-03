import { useFetchOTU } from "@otus/queries";
import { find } from "lodash-es";
import { indexOf, map, sortBy } from "lodash-es/lodash";
import { useLocation } from "react-router-dom";

/**
 * A hook for sorting the sequences for the active isolate
 *
 * @param otuId - The otu which the isolate belongs to
 */
export default function useGetSequences(otuId: string) {
    const { data, isLoading } = useFetchOTU(otuId);
    const location = useLocation<{ activeIsolateId: string }>();

    if (!isLoading) {
        const activeIsolateId = location.state?.activeIsolateId || data.isolates[0]?.id;
        const activeIsolate = data.isolates.length ? find(data.isolates, { id: activeIsolateId }) : null;
        const { sequences } = activeIsolate;

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
}
