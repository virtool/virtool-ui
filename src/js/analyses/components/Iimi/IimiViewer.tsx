import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Box, BoxTitle } from "../../../base";
import { formatIsolateName } from "../../../utils/utils";
import { IimiIsolate } from "./IimiIsolate";

const IimiHitTitle = styled(BoxTitle)`
    justify-content: space-between;
    display: flex;
`;

const ImportantList = styled.ul`
    max-width: 600px;
`;

export function IimiViewer({ detail }) {
    const hits = sortBy(detail.results.hits, hit => !hit.result);

    return (
        <>
            <Box>
                <BoxTitle>Important</BoxTitle>
                <ImportantList>
                    <li>Iimi is an experimental workflow.</li>
                    <li>We do not guarantee the accuracy of the results.</li>
                    <li>This analysis could become inaccessbile at any time as the workflow changes.</li>
                    <li>
                        This analysis viewer is a work in progress. If you think something is missing, we probably know.
                        We will solicit feedback when the viewer is stable.
                    </li>
                </ImportantList>
            </Box>
            {hits.map(hit => (
                <Box key={hit.id}>
                    <IimiHitTitle>
                        <h3>{hit.name}</h3>
                        <span>{hit.result ? "Detected" : "Undetected"}</span>
                    </IimiHitTitle>
                    <div>
                        {hit.isolates.map(isolate => (
                            <IimiIsolate
                                key={isolate.id}
                                name={formatIsolateName(isolate)}
                                sequences={isolate.sequences}
                            />
                        ))}
                    </div>
                </Box>
            ))}
        </>
    );
}
