import { cn } from "@app/utils";
import Badge from "@base/Badge";
import Table from "@base/Table";

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
        <Table className={cn("mt-2.5", "table-fixed")}>
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
                    <td className="font-mono !p-0">
                        <textarea
                            className="w-full p-2"
                            rows={5}
                            value={sequence}
                            readOnly
                        />
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}
