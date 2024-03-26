import { FormattedPathoscopeHit } from "@/analyses/types";
import { getColor } from "@app/theme";
import { AccordionTrigger } from "@base";
import { AccordionContent } from "@base/accordion/AccordionContent";
import { ScrollingAccordionItem } from "@base/accordion/ScrollingAccordionItem";
import { useUrlSearchParams } from "@utils/hooks";
import { toScientificNotation } from "@utils/utils";
import React, { useEffect } from "react";
import styled from "styled-components";
import { OTUCoverage } from "./OTUCoverage";
import { PathoscopeDetail } from "./PathoscopeDetail";

const PathoscopeItemHeader = styled.h3`
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: ${props => props.theme.fontSize.md};
    margin: 5px 0 10px;
`;

const StyledPathoscopeItemValue = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    width: 100px;

    span {
        color: ${getColor};
        font-weight: bold;
    }

    small {
        color: ${props => props.theme.color.greyDark};
        font-size: ${props => props.theme.fontSize.sm};
        font-weight: bold;
        padding-top: 5px;
    }
`;

const PathoscopeItemValue = ({ color, label, value }) => (
    <StyledPathoscopeItemValue color={color}>
        <span>{value}</span>
        <small>{label}</small>
    </StyledPathoscopeItemValue>
);

const PathoscopeItemValues = styled.div`
    display: flex;
    margin-left: auto;
`;

const PathoscopeItemTitle = styled.div`
    display: flex;
    flex-direction: column;
    font-weight: bold;
    align-items: flex-start;

    span:not(:first-child) {
        color: ${props => props.theme.color.greyDark};
        padding-top: 5px;
    }
`;
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
    mappedCount: number;
    match: FormattedPathoscopeHit;
};

/** A single pathoscope hit*/
export function PathoscopeItem({ mappedCount, match }: PathoscopeItemProps) {
    const { abbreviation, coverage, depth, filled, name, pi, id } = match;
    const [showReads] = useUrlSearchParams<boolean>("reads");

    const piValue = showReads ? Math.round(pi * mappedCount) : toScientificNotation(pi);

    return (
        <ScrollingAccordionItem value={id}>
            <PathoscopeAccordionTrigger>
                <PathoscopeItemHeader>
                    <PathoscopeItemTitle>
                        <span>{name}</span>
                        <span>{abbreviation || "No Abbreviation"}</span>
                    </PathoscopeItemTitle>
                    <PathoscopeItemValues>
                        <PathoscopeItemValue color="green" label={showReads ? "READS" : "WEIGHT"} value={piValue} />
                        <PathoscopeItemValue color="red" label="DEPTH" value={depth} />
                        <PathoscopeItemValue color="blue" label="COVERAGE" value={coverage.toFixed(3)} />
                    </PathoscopeItemValues>
                </PathoscopeItemHeader>

                <OTUCoverage filled={filled} />
            </PathoscopeAccordionTrigger>
            <AccordionContent>
                <PathoscopeDetail hit={match} mappedCount={mappedCount} />
            </AccordionContent>
        </ScrollingAccordionItem>
    );
}
