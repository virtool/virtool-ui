import React from "react";
import { SequenceTable } from "../Table";

type BarcodeSequenceTableProps = {
    definition: string;
    host: string;
    sequence: string;
    target: string;
};

/**
 * Displays information about the barcode sequence in the form of a table
 */
export default function BarcodeSequenceTable({ definition, host, sequence, target }: BarcodeSequenceTableProps) {
    return (
        <SequenceTable definition={definition} host={host} sequence={sequence}>
            <tr>
                <th>Target</th>
                <td>{target}</td>
            </tr>
        </SequenceTable>
    );
}
