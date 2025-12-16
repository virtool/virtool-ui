import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import NoneFound from "@base/NoneFound";
import { SubtractionFile } from "@subtraction/types";
import { sortBy } from "es-toolkit";
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
                sortBy(files, [(f) => f.name]).map((file: SubtractionFile) => (
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
