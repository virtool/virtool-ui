import { useUrlSearchParam } from "@app/hooks";
import { cn, toScientificNotation } from "@app/utils";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import React from "react";
import styled from "styled-components";
import { FormattedPathoscopeHit } from "../../types";
import PathoscopeDetail from "./PathoscopeDetail";
import PathoscopeOtuCoverage from "./PathoscopeOtuCoverage";

function PathoscopeItemValue({ color, label, value }) {
    return (
        <div className="flex flex-col w-22" color={color}>
            <span
                className={cn(
                    {
                        "text-blue-700": color === "blue",
                        "text-green-700": color === "green",
                        "text-red-700": color === "red",
                    },
                    "font-bold",
                )}
            >
                {value}
            </span>
            <small className="font-medium mt-1.5 text-gray-500">{label}</small>
        </div>
    );
}

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
                        <PathoscopeItemValue
                            color="green"
                            label={showReads ? "READS" : "WEIGHT"}
                            value={piValue}
                        />
                        <PathoscopeItemValue
                            color="red"
                            label="DEPTH"
                            value={depth}
                        />
                        <PathoscopeItemValue
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
