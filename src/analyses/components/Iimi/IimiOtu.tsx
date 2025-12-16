import AnalysisValue from "@analyses/components/AnalysisValue";
import { FormattedIimiHit, FormattedIimiIsolate } from "@analyses/types";
import { formatIsolateName } from "@app/utils";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import styled from "styled-components";
import { IimiCondensedCoverage } from "./IimiCondensedCoverage";
import { IimiDetection } from "./IimiDetection";
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
    hit: FormattedIimiHit;
    probability: number;
};

/** Collapsible results of an Iimi analysis for a single otu */
export function IimiOtu({
    hit: { id, isolates, name, result, coverage },
    probability,
}: IimiOtuProps) {
    return (
        <AccordionScrollingItem value={id}>
            <IimiAccordionTrigger>
                <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-lg">{name}</h3>
                    <div className="flex gap-4">
                        <IimiDetection
                            probability={probability}
                            result={result}
                        />
                        <AnalysisValue
                            color="blue"
                            value={coverage.toFixed(4)}
                            label="COVERAGE"
                        />
                    </div>
                </div>
                <IimiCondensedCoverage isolates={isolates} />
            </IimiAccordionTrigger>
            <AccordionContent>
                {isolates.map((isolate: FormattedIimiIsolate) => (
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
