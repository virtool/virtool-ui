import { LocationType } from "@/types/types";
import { useGetActiveIsolate } from "@otus/hooks";
import { useCurrentOTUContext } from "@otus/queries";
import sortSequencesBySegment from "@otus/utils";
import { compact, filter, find, map, reject } from "lodash-es";
import { useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * A hook for managing sequence detail visibility.
 *
 * Provides a `expanded` boolean indicating visibility and functions for setting visibility: `expand()` and
 * `collapse()`.
 *
 * @returns {[boolean, (function(): void), (function(): void)]}
 */
export function useExpanded() {
    const [expanded, setExpanded] = useState(false);

    let expand;

    if (!expanded) {
        expand = () => setExpanded(true);
    }

    const collapse = useCallback(() => {
        setExpanded(false);
    }, [expanded]);

    return { expanded, expand, collapse };
}

/**
 * A hook to get the active sequence from the OTU
 *
 * @returns The active sequence
 */
export function useGetActiveSequence() {
    const location = useLocation<LocationType>();
    const { otu } = useCurrentOTUContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const activeSequenceId = location.state?.editSequence;
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    if (activeSequenceId) {
        const sequence = find(sequences, { id: activeSequenceId });

        if (sequence) {
            return sequence;
        }
    }

    return {};
}

/**
 * A hook to get unreferenced targets for a barcode sequence
 *
 * @returns A list of unreferenced targets
 */
export function useGetUnreferencedTargets() {
    const location = useLocation<LocationType>();
    const { otu, reference } = useCurrentOTUContext();
    const { targets } = reference;

    const activeIsolate = useGetActiveIsolate(otu);
    const activeSequenceId = location.state?.editSequence || undefined;
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    const inactiveSequences = reject(sequences, { id: activeSequenceId });
    const referencedTargetNames = map(inactiveSequences, sequence => sequence.target);

    return filter(targets, target => !referencedTargetNames.includes(target.name));
}

/**
 * A hook to get unreferenced segments for a genome sequence
 *
 * @returns A list of unreferenced segments
 */
export function useGetUnreferencedSegments() {
    const location = useLocation<LocationType>();
    const { otu } = useCurrentOTUContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const activeSequenceId = location.state?.editSequence || undefined;
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    const inactiveSequences = reject(sequences, { id: activeSequenceId });

    const referencedSegmentNames = compact(map(inactiveSequences, "segment"));
    return otu.schema.filter(segment => !referencedSegmentNames.includes(segment.name));
}
