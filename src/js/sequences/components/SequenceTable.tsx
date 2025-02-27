import { Badge, Table } from "@base";
import { cn } from "@utils/utils";
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
    children: React.ReactNode;
    definition: string;
    host: string;
    sequence: string;
};

/**
 * Displays the styled table components for sequence items
 */
export function SequenceTable({
    children,
    definition,
    host,
    sequence,
}: SequenceTableProps) {
    return (
        <Table className={cn("mt-2.5", "table-fixed", "[&_th]:w-32.5")}>
            <tbody>
                <tr>
                    <th>Definition</th>
                    <td>{definition}</td>
                </tr>
                {children}
                <tr>
                    <th>Host</th>
                    <td>{host}</td>
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
