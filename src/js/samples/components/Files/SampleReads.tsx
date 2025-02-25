import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { BoxGroup, BoxGroupHeader } from "../../../base";
import { Read } from "../../types";
import { ReadItem } from "./ReadItem";

const SampleReadsTitle = styled.h2`
    display: flex;
    justify-content: space-between;

    & > a {
        cursor: pointer;
    }
`;

type SampleReadsProps = {
    /** A list of reads used to create the sample */
    reads: Read[];
};

/**
 * Displays a list of reads used to create the sample
 */
export default function SampleReads({ reads }: SampleReadsProps) {
    const fileComponents = map(reads, (file) => (
        <ReadItem
            key={file.name}
            name={file.name}
            download_url={file.download_url}
            size={file.size}
        />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <SampleReadsTitle>Reads</SampleReadsTitle>
                <p>The input sequencing data used to create this sample.</p>
            </BoxGroupHeader>
            {fileComponents}
        </BoxGroup>
    );
}
