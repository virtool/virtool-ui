import type { BlastHit } from "@analyses/types";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupTable from "@base/BoxGroupTable";
import Button from "@base/Button";
import ExternalLink from "@base/ExternalLink";
import Icon from "@base/Icon";
import { Redo2 } from "lucide-react";

const identityFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

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
	const components = hits.map((hit) => (
		<tr key={hit.accession}>
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
			<td>{identityFormatter.format(hit.identity / hit.align_len)}</td>
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
