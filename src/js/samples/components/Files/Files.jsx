import React from "react";
import { NarrowContainer } from "../../../base";
import SampleFileSizeWarning from "../Detail/FileSizeWarning";
import SampleFilesMessage from "../LegacyAlert";
import SampleFilesCache from "./Cache";
import SampleReads from "./Reads";

export const SampleDetailFiles = () => (
    <NarrowContainer>
        <SampleFileSizeWarning />
        <SampleFilesMessage />
        <SampleReads />
        <SampleFilesCache />
    </NarrowContainer>
);
