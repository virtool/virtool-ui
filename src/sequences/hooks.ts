import { useUrlSearchParam } from "@app/hooks";
import { useActiveIsolate } from "@otus/hooks";
import { useCurrentOtuContext } from "@otus/queries";
import { OtuSegment, OtuSequence } from "@otus/types";
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
 * A hook to get the active sequence.
 *
 * @returns The active sequence.
 */
export function useActiveSequence(): OtuSequence | undefined {
    const { value: editSequenceId } =
        useUrlSearchParam<string>("editSequenceId");

    const { otu } = useCurrentOtuContext();

    const activeIsolate = useActiveIsolate(otu);
    const sequences = sortSequencesBySegment(
        activeIsolate.sequences,
        otu.schema,
    );

    if (editSequenceId) {
        return find(sequences, { id: editSequenceId });
    }
}

/**
 * A hook to get a list of inactive sequences
 *
 * @returns A list of inactive sequences.
 */
export function useGetInactiveSequences() {}

/**
 * A hook to get unreferenced segments for a genome sequence
 *
 * @returns A list of unreferenced segments
 */
export function useGetUnreferencedSegments() {
    const { otu } = useCurrentOtuContext();

    const { value: editSequenceId } =
        useUrlSearchParam<string>("editSequenceId");

    const activeIsolate = useActiveIsolate(otu);
    const activeSequenceId = editSequenceId || undefined;
    const sequences = sortSequencesBySegment(
        activeIsolate.sequences,
        otu.schema,
    );

    const referencedSegmentNames = compact(
        map(reject(sequences, { id: activeSequenceId }), "segment"),
    );

    return otu.schema.filter(
        (segment: OtuSegment) => !referencedSegmentNames.includes(segment.name),
    );
}
