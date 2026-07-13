import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import ContainerNarrow from "@base/ContainerNarrow";
import type { Label } from "@labels/types";
import { FileManager } from "@uploads/components/FileManager";
import CreateSampleFromFile from "./Create/CreateSampleFromFile";
import CreateSamples from "./Create/CreateSamples";

type SampleFileManagerProps = {
	labels: Label[];
	page: number;
	setPage: (page: number) => void;
};

export default function SampleFileManager({
	labels,
	page,
	setPage,
}: SampleFileManagerProps) {
	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_sample");

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
				renderItemAction={
					canCreate
						? (upload, uploads) => (
								<CreateSampleFromFile
									labels={labels}
									upload={upload}
									uploads={uploads}
								/>
							)
						: undefined
				}
				renderSelectionAction={
					canCreate
						? (selected, deselect) => (
								<CreateSamples
									labels={labels}
									onCreated={deselect}
									uploads={selected}
								/>
							)
						: undefined
				}
				setPage={setPage}
			/>
		</ContainerNarrow>
	);
}
