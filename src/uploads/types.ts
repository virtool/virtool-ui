import { SearchResult } from "@/types/api";
import { UserNested } from "@users/types";

export enum UploadType {
    hmm = "hmm",
    reference = "reference",
    reads = "reads",
    subtraction = "subtraction",
}

export type FileResponse = SearchResult & {
    items: Upload[];
};

export type Upload = {
    id: string;
    created_at: string;
    name: string;
    name_on_disk: string;
    ready: boolean;
    removed: boolean;
    removed_at?: string;
    reserved: boolean;
    size: number;
    type: string;
    uploaded_at: string;
    user: UserNested;
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
