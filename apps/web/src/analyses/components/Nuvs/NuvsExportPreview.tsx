import Table from "@base/Table";

type NuVsExportPreviewProps = {
	mode: string;
};

/**
 * Displays a preview of the Nuvs being exported
 */
export default function NuvsExportPreview({ mode }: NuVsExportPreviewProps) {
	const isContigs = mode === "contigs";

	const previewHeader = isContigs
		? ">sequence_1|17SP002|RNA Polymerase|cg30"
		: ">orf_1_1|17SP002|RNA Polymerase";
	const previewSequence = isContigs
		? "CATTTTATCAATAACAATTAAAACAAACAAACAAAAAAACCTTACCAGCAGCAACAGCAAGATGGCCAAATAGGAACAGATAGGGAC"
		: "ELREECRSLRSRCDQLEERVSAMEDEMNEMKREGKFREKRIKRNEQSLQEIWDYVKRPNLRLIGVPESDGENGTKLENTFREKSAME";
	const indexName = isContigs ? "sequence index" : "sequence index + orf index";
	const indexExample = isContigs ? "sequence_1" : "orf_1_1";
	const barName = isContigs
		? "bar-separated ORF annotations"
		: "best annotation";
	const barExample = isContigs ? "RNA Polymerase|cg30" : "RNA Polymerase";

	return (
		<div>
			<h3>Preview</h3>
			<div className="bg-gray-100 border border-gray-300 rounded shadow-inner text-gray-600 mb-4 min-h-5 p-5">
				<p style={{ wordWrap: "break-word", marginBottom: 0 }}>
					<code>{previewHeader}</code>
				</p>
				<p style={{ wordWrap: "break-word" }}>
					<code>
						{previewSequence}
						&hellip;
					</code>
				</p>
			</div>

			<h3>Header Fields</h3>
			<Table>
				<caption className="sr-only">Export header fields</caption>
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Example</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{indexName}</td>
						<td>
							<code>{indexExample}</code>
						</td>
					</tr>
					<tr>
						<td>sample name</td>
						<td>
							<code>17SP002</code>
						</td>
					</tr>
					<tr>
						<td>{barName}</td>
						<td>
							<code>{barExample}</code>
						</td>
					</tr>
				</tbody>
			</Table>
		</div>
	);
}
