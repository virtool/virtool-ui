import React from "react";
import { ContainerNarrow } from "../../../base";
import SampleFileSizeWarning from "../Detail/FileSizeWarning";
import SampleFilesMessage from "../LegacyAlert";
import SampleReads from "./Reads";

export function SampleDetailFiles() {
    return (
        <ContainerNarrow>
            <SampleFileSizeWarning />
            <SampleFilesMessage />
            <SampleReads />
        </ContainerNarrow>
    );
}
