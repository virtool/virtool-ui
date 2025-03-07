import { cn } from "@/utils";
import Table from '@base/Table';
import Badge from "@base/Badge";
import React from "react";
import styled from "styled-components";

const SequenceCell = styled.td`
    padding: 0 !important;
    font-family: ${(props) => props.theme.fontFamily.monospace};

    textarea {
        width: 100%;
        padding: 5px;
        border: none;
    }
`;

type SequenceTableProps = {
    definition: string;
    host: string;
    segment: string;
    sequence: string;
};

/**
 * Displays information about the genome sequence in the form of a table
 */
export default function SequenceTable({
    definition,
    host,
    segment,
    sequence,
}: SequenceTableProps) {
    return (
        <Table className={cn("mt-2.5", "table-fixed", "[&_th]:w-32.5")}>
            <tbody>
                <tr>
                    <th>Definition</th>
                    <td>{definition}</td>
                </tr>
                <tr>
                    <th>Host</th>
                    <td>{host}</td>
                </tr>
                <tr>
                    <th>Segment</th>
                    <td>{segment || <em>Not configured</em>}</td>
                </tr>
                <tr>
                    <th>
                        Sequence <Badge>{sequence.length}</Badge>
                    </th>
                    <SequenceCell>
                        <textarea rows={5} value={sequence} readOnly />
                    </SequenceCell>
                </tr>
            </tbody>
        </Table>
    );
}
