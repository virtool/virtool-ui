import React from "react";
import { SequenceTable } from "../SequenceTable";

type GenomeSequenceTableProps = {
    definition: string;
    host: string;
    segment: string;
    sequence: string;
};

/**
 * Displays information about the genome sequence in the form of a table
 */
export default function GenomeSequenceTable({
    definition,
    host,
    segment,
    sequence,
}: GenomeSequenceTableProps) {
    return (
        <SequenceTable definition={definition} host={host} sequence={sequence}>
            <tr>
                <th>Segment</th>
                <td>{segment || <em>Not configured</em>}</td>
            </tr>
        </SequenceTable>
    );
}
