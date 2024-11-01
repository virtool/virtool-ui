import { ScrollSync, useUrlSearchParam } from "@utils/hooks";
import { toScientificNotation } from "@utils/utils";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import Coverage from "./Coverage";

const PathoscopeChartRibbon = styled.div`
    white-space: nowrap;
`;

const PathoscopeIsolateHeader = styled.div`
    align-items: center;
    display: flex;
    padding-bottom: 2px;
    padding-top: 15px;
    margin-bottom: 4px;

    & > strong {
        padding-left: 5px;
    }
`;

const PathoscopeIsolateCoverage = styled.strong`
    color: ${props => props.theme.color.blue};
    font-size: ${props => props.theme.fontSize.sm};
    padding-left: 5px;
`;

const PathoscopeIsolateDepth = styled.strong`
    color: ${props => props.theme.color.red};
    font-size: ${props => props.theme.fontSize.sm};
    padding-left: 5px;
`;

const StyledPathoscopeIsolateWeight = styled.strong`
    color: ${props => props.theme.color.green};
    font-size: ${props => props.theme.fontSize.sm};
`;

export function PathoscopeIsolateWeight({ pi, reads }) {
    const [showReads] = useUrlSearchParam("reads");
    return (
        <StyledPathoscopeIsolateWeight>{showReads ? reads : toScientificNotation(pi)}</StyledPathoscopeIsolateWeight>
    );
}

const StyledPathoscopeIsolate = styled.div`
    position: relative;
`;

export function PathoscopeIsolate({ coverage, depth, maxDepth, name, pi, reads, sequences, graphWidth, graphRatios }) {
    const hitComponents = map(sequences, (hit, i) => (
        <Coverage
            key={i}
            data={hit.align}
            length={hit.filled.length}
            id={hit.id}
            accession={hit.accession}
            definition={hit.definition}
            yMax={maxDepth}
            graphWidth={graphWidth}
            graphRatio={graphRatios[i]}
        />
    ));

    return (
        <StyledPathoscopeIsolate>
            <PathoscopeIsolateHeader>
                {name}
                <PathoscopeIsolateWeight pi={pi} reads={reads} />
                <PathoscopeIsolateDepth>{depth.toFixed(0)}</PathoscopeIsolateDepth>
                <PathoscopeIsolateCoverage>{toScientificNotation(parseFloat(coverage))}</PathoscopeIsolateCoverage>
            </PathoscopeIsolateHeader>
            <PathoscopeChartRibbon>
                <ScrollSync>{hitComponents}</ScrollSync>
            </PathoscopeChartRibbon>
        </StyledPathoscopeIsolate>
    );
}
