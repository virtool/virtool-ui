import { LocationType } from "@/types/types";
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
export const useExpanded = () => {
    const [expanded, setExpanded] = useState(false);

    let expand;

    if (!expanded) {
        expand = () => setExpanded(true);
    }

    const collapse = useCallback(() => {
        setExpanded(false);
    }, [expanded]);

    return { expanded, expand, collapse };
};

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

export function useGetActiveIsolate(otu) {
    const location = useLocation<LocationType>();

    const activeIsolateId = location.state?.activeIsolateId || otu.isolates[0]?.id;
    return otu.isolates.length ? find(otu.isolates, { id: activeIsolateId }) : null;
}

export function useGetActiveIsolateId(otu) {
    const location = useLocation<LocationType>();

    return location.state?.activeIsolateId || otu.isolates[0]?.id;
}
