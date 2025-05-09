import NuvsDetail from "@analyses/components/Nuvs/NuvsDetail";
import NuvsItem from "@analyses/components/Nuvs/NuvsItem";
import { useKeyNavigation } from "@analyses/components/Viewer/hooks";
import { useSortAndFilterNuVsHits } from "@analyses/hooks";
import { FormattedNuvsAnalysis } from "@analyses/types";
import { useUrlSearchParam } from "@app/hooks";
import Key from "@base/Key";
import { findIndex } from "lodash-es";
import React from "react";
import { FixedSizeList } from "react-window";

type NuVsListProps = {
    /** Complete Nuvs analysis details */
    detail: FormattedNuvsAnalysis;
};

/**
 * Displays a list of Nuvs hits with a detailed view
 */
export default function NuvsList({ detail }: NuVsListProps) {
    const sortedHits = useSortAndFilterNuVsHits(detail);

    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");

    let nextId: string;
    let nextIndex: number;
    let previousId: string;
    let previousIndex: number;

    if (activeHit) {
        const windowIndex = findIndex(sortedHits, { id: activeHit });

        if (windowIndex > 0) {
            previousIndex = windowIndex - 1;
            previousId = sortedHits[previousIndex].id;
        }

        if (windowIndex < sortedHits.length - 1) {
            nextIndex = windowIndex + 1;
            nextId = sortedHits[nextIndex].id;
        }
    }

    const activeId = Number(activeHit);

    const ref = useKeyNavigation(
        activeId,
        nextId,
        nextIndex,
        previousId,
        previousIndex,
        true,
        (id) => setActiveHit(id),
    );

    const shown = sortedHits.length;
    const total = detail.results.hits.length;
    const width = 230;

    const hitComponents = sortedHits.map((hit) => (
        <NuvsItem key={hit.id} hit={hit} />
    ));

    return (
        <div className="flex gap-4">
            <div>
                <div
                    className="border-1 border-gray-300 overflow-hidden relative rounded"
                    style={{ width: `${width}px` }}
                >
                    <div className="bg-gray-300 py-3 px-4 shadow-sm z-10">
                        Showing {shown} of {total}
                    </div>
                    <FixedSizeList
                        ref={ref}
                        className=""
                        height={500}
                        width={width}
                        itemCount={shown}
                        itemSize={75}
                    >
                        {({ index, style }) => (
                            <div style={style}>{hitComponents[index]}</div>
                        )}
                    </FixedSizeList>
                </div>
                <div className="p-4 text-sm text-center">
                    Use <Key>w</Key> and <Key>s</Key> to move
                </div>
            </div>
            <NuvsDetail
                analysisId={detail.id}
                matches={sortedHits}
                maxSequenceLength={detail.maxSequenceLength}
            />
        </div>
    );
}
