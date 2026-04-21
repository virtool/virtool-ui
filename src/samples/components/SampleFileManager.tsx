import ContainerNarrow from "@base/ContainerNarrow";
import { FileManager } from "@uploads/components/FileManager";

export default function SampleFileManager() {
	return (
		<ContainerNarrow>
			<FileManager
				accept={{
					"application/gzip": [".fasta.gz", ".fa.gz", ".fastq.gz", ".fq.gz"],
					"text/plain": [".fasta", ".fa", ".fastq", ".fq"],
				}}
				fileType="reads"
				message={
					<div className="flex flex-col gap-1 items-center">
						<span className="font-medium text-lg">
							Drag files here to upload
						</span>
						<span className="text-gray-600">
							Supports plain or gzipped FASTA and FASTQ
						</span>
					</div>
				}
				regex={/\.f(ast)?q(\.gz)?$/}
			/>
		</ContainerNarrow>
	);
}
