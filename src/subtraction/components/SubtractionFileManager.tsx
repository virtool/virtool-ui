import { FileManager } from "@/uploads/components/FileManager";
import { UploadType } from "@/uploads/types";
import React from "react";

/**
 * Displays a list of subtraction uploads with functionality to upload/delete uploads
 */
export function SubtractionFileManager() {
    return (
        <FileManager
            accept={{
                "application/gzip": [".fasta.gz", ".fa.gz"],
                "application/text": [".fasta", ".fa"],
            }}
            fileType={UploadType.subtraction}
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
        />
    );
}
