import NuvsDetail from "@analyses/components/Nuvs/NuvsDetail";
import NuvsItem from "@analyses/components/Nuvs/NuvsItem";
import { useKeyNavigation } from "@analyses/components/Viewer/hooks";
import { useSortAndFilterNuVsHits } from "@analyses/hooks";
import { FormattedNuvsAnalysis } from "@analyses/types";
import { useUrlSearchParam } from "@app/hooks";
import Key from "@base/Key";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

type NuVsListProps = {
    /** Complete Nuvs analysis details */
    detail: FormattedNuvsAnalysis;
};

/**
 * Displays a list of Nuvs hits with a detailed view
 */
export default function NuvsList({ detail }: NuVsListProps) {
    const sortedHits = useSortAndFilterNuVsHits(detail);

    const firstHitId = sortedHits[0]?.id ? String(sortedHits[0].id) : undefined;
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit", firstHitId);

    let nextId: string | undefined;
    let nextIndex: number | undefined;
    let previousId: string | undefined;
    let previousIndex: number | undefined;

    if (activeHit) {
        const windowIndex = sortedHits.findIndex(
            (hit) => hit.id === Number(activeHit),
        );

        if (windowIndex > 0) {
            previousIndex = windowIndex - 1;
            previousId = String(sortedHits[previousIndex].id);
        }

        if (windowIndex < sortedHits.length - 1) {
            nextIndex = windowIndex + 1;
            nextId = String(sortedHits[nextIndex].id);
        }
    }

    const shown = sortedHits.length;
    const total = detail.results.hits.length;
    const width = 230;

    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: shown,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 75,
        overscan: 5,
    });

    useKeyNavigation(
        virtualizer,
        nextId,
        nextIndex,
        previousId,
        previousIndex,
        (id) => setActiveHit(id),
    );

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
                    <div
                        ref={parentRef}
                        className="h-[500px] overflow-auto"
                        style={{ width }}
                    >
                        <div
                            className="relative w-full"
                            style={{ height: virtualizer.getTotalSize() }}
                        >
                            {virtualizer.getVirtualItems().map((virtualRow) => (
                                <div
                                    key={virtualRow.key}
                                    className="absolute left-0 top-0 w-full"
                                    style={{
                                        height: virtualRow.size,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {hitComponents[virtualRow.index]}
                                </div>
                            ))}
                        </div>
                    </div>
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
