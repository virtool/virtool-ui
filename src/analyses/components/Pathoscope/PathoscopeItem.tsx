import AnalysisValue from "@analyses/components/AnalysisValue";
import { FormattedPathoscopeHit } from "@analyses/types";
import { useUrlSearchParam } from "@app/hooks";
import { toScientificNotation } from "@app/utils";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import styled from "styled-components";
import PathoscopeDetail from "./PathoscopeDetail";
import PathoscopeOtuCoverage from "./PathoscopeOtuCoverage";

const PathoscopeAccordionTrigger = styled(AccordionTrigger)`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;

    & > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
`;

type PathoscopeItemProps = {
    /** Complete information for a pathoscope hit */
    hit: FormattedPathoscopeHit;

    /** The total number of reads mapped to any OTU during the analysis*/
    mappedCount: number;
};

/** Results for a single pathoscope analysis hit  */
export function PathoscopeItem({ mappedCount, hit }: PathoscopeItemProps) {
    const { abbreviation, coverage, depth, filled, name, pi, id } = hit;
    const { value: showReads } = useUrlSearchParam<boolean>("reads");

    const piValue = showReads
        ? Math.round(pi * mappedCount)
        : toScientificNotation(pi);

    return (
        <AccordionScrollingItem value={id}>
            <PathoscopeAccordionTrigger>
                <div className="flex justify-between mb-4">
                    <header className="flex flex-col font-medium items-start text-lg">
                        <span className="mb-0.5">{name}</span>
                        <span className="text-gray-500">
                            {abbreviation || "No Abbreviation"}
                        </span>
                    </header>
                    <div className="flex gap-4">
                        <AnalysisValue
                            color="green"
                            label={showReads ? "READS" : "WEIGHT"}
                            value={piValue}
                        />
                        <AnalysisValue
                            color="red"
                            label="DEPTH"
                            value={depth}
                        />
                        <AnalysisValue
                            color="blue"
                            label="COVERAGE"
                            value={coverage.toFixed(3)}
                        />
                    </div>
                </div>

                <PathoscopeOtuCoverage filled={filled} />
            </PathoscopeAccordionTrigger>
            <AccordionContent>
                <PathoscopeDetail hit={hit} mappedCount={mappedCount} />
            </AccordionContent>
        </AccordionScrollingItem>
    );
}
