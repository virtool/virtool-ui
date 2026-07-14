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
			hint="Supports plain or gzipped FASTA"
			regex={/\.(?:fa|fasta)(?:\.gz|\.gzip)?$/}
			setPage={setPage}
		/>
	);
}
