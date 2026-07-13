import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import ContainerNarrow from "@base/ContainerNarrow";
import Icon from "@base/Icon";
import LinkButton from "@base/LinkButton";
import LinkIconButton from "@base/LinkIconButton";
import { FileManager } from "@uploads/components/FileManager";
import { getReadsForUpload } from "@uploads/pairing";
import { CirclePlus } from "lucide-react";

type SampleFileManagerProps = {
	page: number;
	setPage: (page: number) => void;
};

export default function SampleFileManager({
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
								<LinkIconButton
									color="blue"
									IconComponent={CirclePlus}
									search={{
										// The file's mate comes along, so a pair creates one
										// paired sample rather than two unpaired ones.
										upload: getReadsForUpload(upload, uploads).map(
											(read) => read.id,
										),
									}}
									tip="create sample"
									to="/samples/create"
								/>
							)
						: undefined
				}
				renderSelectionAction={
					canCreate
						? (selected) => (
								<LinkButton
									color="blue"
									search={{ upload: selected.map((upload) => upload.id) }}
									size="small"
									to="/samples/create"
								>
									<Icon icon={CirclePlus} /> Create Samples
								</LinkButton>
							)
						: undefined
				}
				setPage={setPage}
			/>
		</ContainerNarrow>
	);
}
