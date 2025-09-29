import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import Accordion from "@base/Accordion";
import { map } from "lodash-es";
import { PathoscopeItem } from "./PathoscopeItem";

/** A list of Pathoscope analysis results*/
export function PathoscopeList({ detail, sample }) {
    return (
        <Accordion type="single" collapsible>
            {map(
                useSortAndFilterPathoscopeHits(
                    detail,
                    sample.quality.length[1],
                ),
                (hit) => (
                    <PathoscopeItem
                        key={hit.id}
                        hit={hit}
                        mappedCount={detail.results.readCount}
                    />
                ),
            )}
        </Accordion>
    );
}
