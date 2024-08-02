import { BoxGroup, BoxGroupHeader } from "@base";
import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
import { IndexFile } from "@indexes/types";
import { File } from "@subtraction/components/Detail/File";
import { map } from "lodash-es";
import React from "react";

type IndexFilesProps = {
    files: IndexFile[];
};

/**
 * A list of the files associated with the index
 */
export default function IndexFiles({ files }: IndexFilesProps) {
    const fileComponents = map(files, file => <File file={file} key={file.id} />);

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    Files
                    <BoxGroupHeaderBadge>{files.length}</BoxGroupHeaderBadge>
                </h2>
                Data files available to workflows using this index.
            </BoxGroupHeader>
            {fileComponents}
        </BoxGroup>
    );
}
