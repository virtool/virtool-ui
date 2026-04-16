import Table from "@base/Table";

type NuVsExportPreviewProps = {
	mode: string;
};

/**
 * Displays a preview of the Nuvs being exported
 */
export default function NuvsExportPreview({ mode }: NuVsExportPreviewProps) {
	let previewHeader = ">sequence_1|17SP002|RNA Polymerase";
	let previewSequence;
	let indexName;
	let indexExample;
	let barName;
	let barExample;

	if (mode === "contigs") {
		indexName = "sequence index";
		indexExample = "sequence_1";

		barName = "bar-separated ORF annotations";
		barExample = "RNA Polymerase|cg30";

		previewHeader += "|cg30";
		previewSequence =
			"CATTTTATCAATAACAATTAAAACAAACAAACAAAAAAACCTTACCAGCAGCAACAGCAAGATGGCCAAATAGGAACAGATAGGGAC";
	} else {
		indexName = "sequence index + orf index";
		indexExample = "orf_1_1";

		barName = "best annotation";
		barExample = "RNA Polymerase";

		previewHeader = previewHeader.replace("sequence_1", "orf_1_1");
		previewSequence =
			"ELREECRSLRSRCDQLEERVSAMEDEMNEMKREGKFREKRIKRNEQSLQEIWDYVKRPNLRLIGVPESDGENGTKLENTFREKSAME";
	}

	return (
		<div>
			<label>Preview</label>
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

			<label>Header Fields</label>
			<Table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Example</th>
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
