import { FileManager } from "@files/components/FileManager";
import { FileType } from "@files/types";
import React from "react";

/**
 * Displays a list of subtraction files with functionality to upload/delete files
 */
export function SubtractionFileManager() {
    return (
        <FileManager
            fileType={FileType.subtraction}
            message={
                <div className="flex flex-col gap-1 items-center">
                    <span className="font-medium text-base">Drag FASTA files here to upload</span>
                    <span className="text-sm text-gray-600">
                        Accepts files ending in fa, fasta, fa.gz, or fasta.gz.
                    </span>
                </div>
            }
            regex={/\.(?:fa|fasta)(?:\.gz|\.gzip)?$/}
        />
    );
}
