import { useUrlSearchParam } from "@app/hooks";
import { useGetActiveIsolate } from "@otus/hooks";
import { useCurrentOtuContext } from "@otus/queries";
import sortSequencesBySegment from "@otus/utils";
import { compact, find, map, reject } from "lodash-es";
import { useCallback, useState } from "react";

type UseExpandedResult = {
    expanded: boolean;
    expand: () => void;
    collapse: () => void;
};

/**
 * A hook for managing sequence detail visibility.
 *
 * Provides a `expanded` boolean indicating visibility and functions for setting visibility: `expand()` and
 * `collapse()`.
 */
export function useExpanded(): UseExpandedResult {
    const [expanded, setExpanded] = useState(false);

    function expand() {
        setExpanded(true);
    }

    const collapse = useCallback(() => {
        setExpanded(false);
    }, []);

    return { expanded, expand, collapse };
}

/**
 * A hook to get the active sequence from the OTU
 *
 * @returns The active sequence
 */
export function useGetActiveSequence() {
    const { value: editSequenceId } = useUrlSearchParam("editSequenceId");
    const { otu } = useCurrentOtuContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const sequences = sortSequencesBySegment(
        activeIsolate.sequences,
        otu.schema,
    );

    if (editSequenceId) {
        const sequence = find(sequences, { id: editSequenceId });

        if (sequence) {
            return sequence;
        }
    }

    return {};
}

/**
 * A hook to get a list of inactive sequences
 *
 * @returns A list of inactive sequences
 */
export function useGetInactiveSequences() {
    const { value: editSequenceId } = useUrlSearchParam("editSequenceId");

    const { otu } = useCurrentOtuContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const activeSequenceId = editSequenceId || undefined;
    const sequences = sortSequencesBySegment(
        activeIsolate.sequences,
        otu.schema,
    );

    return reject(sequences, { id: activeSequenceId });
}

/**
 * A hook to get unreferenced segments for a genome sequence
 *
 * @returns A list of unreferenced segments
 */
export function useGetUnreferencedSegments() {
    const { otu } = useCurrentOtuContext();

    const inactiveSequences = useGetInactiveSequences();
    const referencedSegmentNames = compact(map(inactiveSequences, "segment"));

    return otu.schema.filter(
        (segment) => !referencedSegmentNames.includes(segment.name),
    );
}
