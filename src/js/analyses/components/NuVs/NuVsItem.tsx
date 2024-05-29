import NuVsDetail from "@/analyses/components/NuVs/NuVsDetail";
import { FormattedNuVsHit } from "@/analyses/types";
import { AccordionContent, AccordionTrigger, Badge, ScrollingAccordionItem } from "@base";
import { toString } from "lodash-es";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";
import { NuVsValues } from "./NuVsValues";

const NuVsItemHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

const NuVsAccordionTrigger = styled(AccordionTrigger)`
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

type NuVsItemProps = {
    analysisId: string;
    /** Complete information for a NuVs hit */
    hit: FormattedNuVsHit;
    maxSequenceLength: number;
};

/**
 * A condensed NuVs item for use in a list of NuVs
 */
export default function NuVsItem({ analysisId, hit, maxSequenceLength }: NuVsItemProps) {
    const { id, e, annotatedOrfCount, sequence, index } = hit;

    return (
        <ScrollingAccordionItem value={toString(id + 1)}>
            <NuVsAccordionTrigger>
                <NuVsItemHeader>
                    <strong>Sequence {index}</strong>
                    <Badge>{sequence.length}</Badge>
                </NuVsItemHeader>
                <NuVsValues e={numbro(e).format()} orfCount={annotatedOrfCount} />
            </NuVsAccordionTrigger>
            <AccordionContent>
                <NuVsDetail analysisId={analysisId} hit={hit} maxSequenceLength={maxSequenceLength} />
            </AccordionContent>
        </ScrollingAccordionItem>
    );
}
