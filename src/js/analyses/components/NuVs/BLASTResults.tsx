import { BlastHit } from "@/analyses/types";
import { BoxGroup, BoxGroupHeader, BoxGroupTable, Button, ExternalLink, Icon } from "@base";
import { map } from "lodash";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";

const StyledBLASTResultsHeader = styled(BoxGroupHeader)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px 7px 15px;

    i.fas {
        margin-right: 5px;
    }
`;

type BLASTResultsProps = {
    /** A list of the blast hits */
    hits: BlastHit[];
    /** A callback function to  */
    onBlast: () => void;
};

/**
 * Displays the results of the blast installed for the sequence
 */
export function BLASTResults({ hits, onBlast }: BLASTResultsProps) {
    const components = map(hits, (hit, index) => (
        <tr key={index}>
            <td>
                <ExternalLink href={`https://www.ncbi.nlm.nih.gov/nuccore/${hit.accession}`}>
                    {hit.accession}
                </ExternalLink>
            </td>
            <td>{hit.name}</td>
            <td>{hit.evalue}</td>
            <td>{hit.score}</td>
            <td>{numbro(hit.identity / hit.align_len).format("0.00")}</td>
        </tr>
    ));

    return (
        <BoxGroup>
            <StyledBLASTResultsHeader>
                <strong>NCBI BLAST</strong>
                <Button onClick={onBlast} color="blue">
                    <Icon name="redo" />
                    Retry
                </Button>
            </StyledBLASTResultsHeader>
            <BoxGroupTable>
                <thead>
                    <tr>
                        <th>Accession</th>
                        <th>Name</th>
                        <th>E-value</th>
                        <th>Score</th>
                        <th>Identity</th>
                    </tr>
                </thead>
                <tbody>{components}</tbody>
            </BoxGroupTable>
        </BoxGroup>
    );
}
