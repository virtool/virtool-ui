import type { UserNested } from "@users/types";
import type { SearchResult } from "@/types/api";

export type UploadType = "reference" | "reads" | "subtraction";

export type FileResponse = SearchResult & {
	items: Upload[];
};

export type Upload = {
	id: number;
	created_at: string;
	name: string;
	ready: boolean;
	removed: boolean;
	removed_at: string | null;
	reserved: boolean;
	size: number;
	type: string;
	uploaded_at: string;
	user: UserNested | null;
};

export type UploadInProgress = {
	/* Whether the upload failed */
	failed: boolean;

	fileType: UploadType;

	loaded: number;

	localId: string;

	name: string;

	/* Progress of the upload in percentage */
	progress: number;

	/* Size of the file in bytes */
	size: number;
};
