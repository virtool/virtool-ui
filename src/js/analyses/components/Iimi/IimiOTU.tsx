import { map } from "lodash-es";
import React from "react";
import { Label } from "../../../base";
import { AccordionContent } from "../../../base/accordion/AccordionContent";
import { AccordionTrigger } from "../../../base/accordion/AccordionTrigger";
import { ScrollingAccordionItem } from "../../../base/accordion/ScrollingAccordionItem";
import { formatIsolateName } from "../../../utils/utils";
import { IimiHit, IimiIsolate as IimiIsolateData } from "../../types";
import { IimiIsolate } from "./IimiIsolate";

/** Collapsible results of an Iimi anaylsis for a single otu */
export function IimiOTU({ hit: { id, name, result, isolates } }: { hit: IimiHit }) {
    return (
        <ScrollingAccordionItem value={id}>
            <AccordionTrigger>
                <h3>{name}</h3>
                {result ? <Label color="red">Detected</Label> : <Label color="grey">Undetected</Label>}
            </AccordionTrigger>
            <AccordionContent>
                {map(isolates, (isolate: IimiIsolateData) => (
                    <IimiIsolate name={formatIsolateName(isolate)} sequences={isolate.sequences} key={isolate.id} />
                ))}
            </AccordionContent>
        </ScrollingAccordionItem>
    );
}
