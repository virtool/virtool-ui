import { OTUSegment, OTUSequence } from "@otus/types";
import { map } from "lodash";
import { indexOf, sortBy } from "lodash-es";

/**
 * A hook for sorting the sequences for the active isolate
 *
 * @param sequences - The active isolate sequences
 * @param segments - The segments associated with the OTU
 */
export default function sortSequencesBySegment(
    sequences: OTUSequence[],
    segments: OTUSegment,
): OTUSequence[] {
    if (sequences) {
        const segmentNames = map(segments, "name");
        return sortBy(sequences, [
            (entry) => {
                const index = indexOf(segmentNames, entry.segment);
                return index !== -1 ? index : segmentNames.length;
            },
        ]);
    }

    return [];
}
