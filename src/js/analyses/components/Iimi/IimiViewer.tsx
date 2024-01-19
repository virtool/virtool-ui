import { map } from "lodash";
import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader, Table } from "../../../base";

const ResultsTable = styled(Table)`
    margin-bottom: 10px;
`;

export function IimiViewer({ detail }) {
    const sortedHits = sortBy(detail.results.hits, hit => !hit.result);

    const results = map(sortedHits, hit => {
        return (
            <tr>
                <th>{hit.name}</th>
                <td>{hit.result ? "Detected" : "Undetected"}</td>
            </tr>
        );
    });
    return (
        <>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>Results</h2>
                </BoxGroupHeader>
                <ResultsTable>
                    <tbody>{results}</tbody>
                </ResultsTable>
            </BoxGroup>
        </>
    );
}
