import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import { SubtractionFileItem } from "@subtraction/components/Detail/SubtractionFileItem";
import React from "react";
import { IndexFile } from "../types";

type IndexFilesProps = {
    files: IndexFile[];
};

/**
 * A list of the uploads associated with the index
 */
export default function IndexFiles({ files }: IndexFilesProps) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 className="flex items-center gap-2">
                    <span>Files</span>
                    <Badge>{files.length}</Badge>
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
