import { NoneFound } from "@base";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import { SubtractionFile } from "@subtraction/types";
import { sortBy } from "lodash-es";
import React from "react";
import { SubtractionFileItem } from "./SubtractionFileItem";

export type SubtractionFilesProps = {
    files: SubtractionFile[];
};

export default function SubtractionFiles({ files }) {
    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>Files</h2>
                <p>Data files available to workflows using this subtraction.</p>
            </BoxGroupHeader>
            {files.length ? (
                sortBy(files).map((file: SubtractionFile) => (
                    <SubtractionFileItem
                        downloadUrl={file.download_url}
                        name={file.name}
                        size={file.size}
                        key={file.id}
                    />
                ))
            ) : (
                <NoneFound noun="subtraction files" />
            )}
        </BoxGroup>
    );
}
