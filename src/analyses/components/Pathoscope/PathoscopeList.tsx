import { FormattedPathoscopeAnalysis } from "@/analyses/types";
import { Sample } from "@/samples/types";
import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import Accordion from "@base/Accordion";
import { PathoscopeItem } from "./PathoscopeItem";

type PathoscopeListProps = {
    analysis: FormattedPathoscopeAnalysis;
    sample: Sample;
};

/** A list of Pathoscope hits. */
export function PathoscopeList({ analysis, sample }: PathoscopeListProps) {
    return (
        <Accordion type="single" collapsible>
            {useSortAndFilterPathoscopeHits(
                analysis,
                sample.quality.length[1],
            ).map((hit) => (
                <PathoscopeItem
                    key={hit.id}
                    hit={hit}
                    mappedCount={analysis.results.readCount}
                />
            ))}
        </Accordion>
    );
}
