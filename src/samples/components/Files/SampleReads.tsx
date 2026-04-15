import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import type { Read } from "@samples/types";
import ReadItem from "./ReadItem";

type SampleReadsProps = {
	/** A list of reads used to create the sample */
	reads: Read[];
	/** The name of the sample */
	sampleName: string;
};

/**
 * Extract the read side (1 or 2) from a read filename like "reads_1.fq.gz"
 */
function extractReadSide(name: string): number {
	const match = name.match(/reads_(\d+)/);
	return match ? parseInt(match[1], 10) : 1;
}

/**
 * Displays a list of reads used to create the sample
 */
export default function SampleReads({ reads, sampleName }: SampleReadsProps) {
	const fileComponents = reads.map((file) => (
		<ReadItem
			key={file.name}
			download_url={file.download_url}
			sampleName={sampleName}
			side={extractReadSide(file.name)}
			size={file.size}
		/>
	));

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2 className="flex justify-between">Reads</h2>
				<p>The input sequencing data used to create this sample.</p>
			</BoxGroupHeader>
			{fileComponents}
		</BoxGroup>
	);
}
