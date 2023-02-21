import React from "react";
import { ContainerNarrow } from "../../../base";
import SampleFileSizeWarning from "../Detail/FileSizeWarning";
import SampleFilesMessage from "../LegacyAlert";
import SampleFilesCache from "./Cache";
import SampleReads from "./Reads";

export const SampleDetailFiles = () => (
    <ContainerNarrow>
        <SampleFileSizeWarning />
        <SampleFilesMessage />
        <SampleReads />
        <SampleFilesCache />
    </ContainerNarrow>
);
