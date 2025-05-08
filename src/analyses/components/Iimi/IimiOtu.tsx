import { formatIsolateName } from "@app/utils";
import AccordionContent from "@base/AccordionContent";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import AccordionScrollingItem from "../../../base/AccordionScrollingItem";
import AccordionTrigger from "../../../base/AccordionTrigger";
import { IimiHit, IimiIsolate as IimiIsolateData } from "../../types";
import { IimiCondensedCoverage } from "./IimiCondensedCoverage";
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

type IimiOtuProps = {
    hit: IimiHit;
    probability: number;
};

/** Collapsible results of an Iimi analysis for a single otu */
export function IimiOtu({
    hit: { id, isolates, name, result },
    probability,
}: IimiOtuProps) {
    return (
        <AccordionScrollingItem value={id}>
            <IimiAccordionTrigger>
                <div>
                    <h3>{name}</h3>
                    <IimiDetectionTag
                        probability={probability}
                        result={result}
                    />
                </div>
                <IimiCondensedCoverage isolates={isolates} />
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
