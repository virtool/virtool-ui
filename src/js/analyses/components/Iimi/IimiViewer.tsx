import { IimiAnalysis } from "@/analyses/types";
import { BoxTitle } from "@base";
import Accordion from "@base/Accordion";
import Box from "@base/Box";
import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { IimiOTU } from "./IimiOTU";

const ImportantList = styled.ul`
    max-width: 600px;
`;

export function IimiViewer({ detail }: { detail: IimiAnalysis }) {
    const hits = sortBy(detail.results.hits, (hit) => !hit.result);

    return (
        <>
            <Box>
                <BoxTitle>Important</BoxTitle>
                <ImportantList>
                    <li>Iimi is an experimental workflow.</li>
                    <li>We do not guarantee the accuracy of the results.</li>
                    <li>
                        This analysis could become inaccessbile at any time as
                        the workflow changes.
                    </li>
                    <li>
                        This analysis viewer is a work in progress. Some
                        features may not be present as we continue to improve
                        the viewer.
                    </li>
                </ImportantList>
            </Box>
            <Accordion type="single" collapsible>
                {hits.map((hit) => (
                    <IimiOTU hit={hit} key={hit.id} />
                ))}
            </Accordion>
        </>
    );
}
