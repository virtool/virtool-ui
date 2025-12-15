import { indexOf, map, sortBy } from "lodash-es";
import { OtuSegment, OtuSequence } from "./types";

/**
 * A hook for sorting the sequences for the active isolate
 *
 * @param sequences - The active isolate sequences
 * @param segments - The segments associated with the OTU
 */
export default function sortSequencesBySegment(
    sequences: OtuSequence[],
    segments: OtuSegment,
): OtuSequence[] {
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
