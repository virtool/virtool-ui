import ContainerNarrow from "@base/ContainerNarrow";
import { FileManager } from "@uploads/components/FileManager";

type SampleFileManagerProps = {
	page: number;
	setPage: (page: number) => void;
};

export default function SampleFileManager({
	page,
	setPage,
}: SampleFileManagerProps) {
	return (
		<ContainerNarrow>
			<FileManager
				accept={{
					"application/gzip": [".fasta.gz", ".fa.gz", ".fastq.gz", ".fq.gz"],
					"text/plain": [".fasta", ".fa", ".fastq", ".fq"],
				}}
				fileType="reads"
				page={page}
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
				setPage={setPage}
			/>
		</ContainerNarrow>
	);
}
