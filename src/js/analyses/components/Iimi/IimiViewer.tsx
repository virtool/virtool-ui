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

export function IimiViewer({ detail }) {
    const hits = sortBy(detail.results.hits, hit => !hit.result);

    return (
        <>
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
