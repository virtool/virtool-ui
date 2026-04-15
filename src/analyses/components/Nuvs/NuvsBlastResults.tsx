import type { BlastHit } from "@analyses/types";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import Button from "@base/Button";
import ExternalLink from "@base/ExternalLink";
import Icon from "@base/Icon";
import { Redo2 } from "lucide-react";
import numbro from "numbro";

type BLASTResultsProps = {
	/** A list of the blast hits */
	hits: BlastHit[];
	/** A callback function to  */
	onBlast: () => void;
};

/**
 * Displays the results of the blast installed for the sequence
 */
export default function NuvsBlastResults({ hits, onBlast }: BLASTResultsProps) {
	const components = hits.map((hit, index) => (
		<tr key={index}>
			<td>
				<ExternalLink
					href={`https://www.ncbi.nlm.nih.gov/nuccore/${hit.accession}`}
				>
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
			<BoxGroupHeader className="flex-row items-center justify-between px-4 py-2.5 [&_svg]:mr-1">
				<strong>NCBI BLAST</strong>
				<Button onClick={onBlast}>
					<Icon icon={Redo2} />
					Retry
				</Button>
			</BoxGroupHeader>
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
