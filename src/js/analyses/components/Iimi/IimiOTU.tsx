import { formatIsolateName } from "@/utils";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { IimiHit, IimiIsolate as IimiIsolateData } from "../../types";
import { CondensedIimiCoverage } from "./CondensedIimiCoverage";
import { IimiDetectionTag } from "./IimiDetectionTag";
import { IimiIsolate } from "./IimiIsolate";

const IimiAccordionTrigger = styled(AccordionTrigger)`
    display: flex;
    flex-direction: column;
    overflow: hidden;

    & > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
`;

/** Collapsible results of an Iimi analysis for a single otu */
export function IimiOTU({
    hit: { id, name, result, isolates },
}: {
    hit: IimiHit;
}) {
    return (
        <AccordionScrollingItem value={id}>
            <IimiAccordionTrigger>
                <div>
                    <h3>{name}</h3>
                    <IimiDetectionTag result={result} />
                </div>
                <CondensedIimiCoverage isolates={isolates} />
            </IimiAccordionTrigger>
            <AccordionContent>
                {map(isolates, (isolate: IimiIsolateData) => (
                    <IimiIsolate
                        name={formatIsolateName(isolate)}
                        sequences={isolate.sequences}
                        key={isolate.id}
                    />
                ))}
            </AccordionContent>
        </AccordionScrollingItem>
    );
}
