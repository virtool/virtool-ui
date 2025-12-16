import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import Accordion from "@base/Accordion";
import { PathoscopeItem } from "./PathoscopeItem";

/** A list of Pathoscope analysis results*/
export function PathoscopeList({ detail, sample }) {
    return (
        <Accordion type="single" collapsible>
            {useSortAndFilterPathoscopeHits(
                detail,
                sample.quality.length[1],
            ).map((hit) => (
                <PathoscopeItem
                    key={hit.id}
                    hit={hit}
                    mappedCount={detail.results.readCount}
                />
            ))}
        </Accordion>
    );
}
