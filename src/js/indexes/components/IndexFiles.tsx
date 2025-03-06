import { BoxGroupHeader } from "@/base";
import BoxGroup from "@base/BoxGroup";
import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
import { IndexFile } from "@indexes/types";
import { SubtractionFileItem } from "@subtraction/components/Detail/SubtractionFileItem";
import React from "react";

type IndexFilesProps = {
    files: IndexFile[];
};

/**
 * A list of the files associated with the index
 */
export default function IndexFiles({ files }: IndexFilesProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    Files
                    <BoxGroupHeaderBadge>{files.length}</BoxGroupHeaderBadge>
                </h2>
                Data files available to workflows using this index.
            </BoxGroupHeader>
            {files.map((file: IndexFile) => (
                <SubtractionFileItem
                    key={file.id}
                    downloadUrl={file.download_url}
                    name={file.name}
                    size={file.size}
                />
            ))}
        </BoxGroup>
    );
}
