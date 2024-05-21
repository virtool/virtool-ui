import { map } from "lodash-es";
import React from "react";
import { Badge, BoxGroup, BoxGroupHeader } from "../../base";
import { File as IndexFile } from "../../subtraction/components/Detail/File";

export default function Files({ files }) {
    const fileComponents = map(files, file => <IndexFile file={file} key={file.id} />);
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    Files
                    <Badge>{files.length}</Badge>
                </h2>
                Data files available to workflows using this index.
            </BoxGroupHeader>
            {fileComponents}
        </BoxGroup>
    );
}
