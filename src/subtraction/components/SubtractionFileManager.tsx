import { FileManager } from "@/uploads/components/FileManager";

type SubtractionFileManagerProps = {
	page?: number;
	setPage?: (page: number) => void;
};

/**
 * Displays a list of subtraction uploads with functionality to upload/delete uploads
 */
export function SubtractionFileManager({
	page = 1,
	setPage = () => {},
}: SubtractionFileManagerProps) {
	return (
		<FileManager
			accept={{
				"application/gzip": [".fasta.gz", ".fa.gz"],
				"application/text": [".fasta", ".fa"],
			}}
			fileType="subtraction"
			page={page}
			message={
				<div className="flex flex-col gap-1 items-center">
					<span className="font-medium text-base">
						Drag files here to upload
					</span>
					<span className="text-gray-600 text-sm">
						Supports plain or gzipped FASTA
					</span>
				</div>
			}
			regex={/\.(?:fa|fasta)(?:\.gz|\.gzip)?$/}
			setPage={setPage}
		/>
	);
}
