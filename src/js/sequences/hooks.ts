import { useGetActiveIsolate } from "@otus/hooks";
import { useCurrentOTUContext } from "@otus/queries";
import sortSequencesBySegment from "@otus/utils";
import { useUrlSearchParam } from "@utils/hooks";
import { compact, filter, find, map, reject } from "lodash-es";
import { useCallback, useState } from "react";

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
    const { value: editSequenceId } = useUrlSearchParam("editSequenceId");
    const { otu } = useCurrentOTUContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

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

    const { otu } = useCurrentOTUContext();

    const activeIsolate = useGetActiveIsolate(otu);
    const activeSequenceId = editSequenceId || undefined;
    const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

    return reject(sequences, { id: activeSequenceId });
}

/**
 * A hook to get unreferenced targets for a barcode sequence
 *
 * @returns A list of unreferenced targets
 */
export function useGetUnreferencedTargets() {
    const {
        otu,
        reference: { targets },
    } = useCurrentOTUContext();

    const { sequences } = useGetActiveIsolate(otu);
    const referencedTargetNames = map(sequences, sequence => sequence.target);

    return filter(targets, target => !referencedTargetNames.includes(target.name));
}

/**
 * Get a list of targets that are valid selections for the active sequence
 *
 * @returns A list of unreferenced targets
 */
export function useGetSelectableTargets() {
    const { reference } = useCurrentOTUContext();
    const { targets } = reference;

    const inactiveSequences = useGetInactiveSequences();
    const referencedTargetNames = map(inactiveSequences, sequence => sequence.target);

    return filter(targets, target => !referencedTargetNames.includes(target.name));
}

/**
 * A hook to get unreferenced segments for a genome sequence
 *
 * @returns A list of unreferenced segments
 */
export function useGetUnreferencedSegments() {
    const { otu } = useCurrentOTUContext();

    const inactiveSequences = useGetInactiveSequences();
    const referencedSegmentNames = compact(map(inactiveSequences, "segment"));

    return otu.schema.filter(segment => !referencedSegmentNames.includes(segment.name));
}
