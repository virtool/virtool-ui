import { FileManager } from "../../files/components/FileManager";
import { FileType } from "../../files/types";
import React from "react";

/**
 * Displays a list of subtraction files with functionality to upload/delete files
 */
export function SubtractionFileManager() {
    return (
        <FileManager
            accept={{
                "application/gzip": [".fasta.gz", ".fa.gz"],
                "application/text": [".fasta", ".fa"],
            }}
            fileType={FileType.subtraction}
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
