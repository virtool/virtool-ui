import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, getFontWeight } from "../../app/theme";
import { FileManager } from "../../files/components/Manager";
import { FileType } from "../../files/types";

/**
 * Displays a list of subtraction files with functionality to upload/delete files
 */
export function SubtractionFileManager() {
    return (
        <FileManager
            fileType={FileType.subtraction}
            validationRegex={/\.(?:fa|fasta)(?:\.gz|\.gzip)?$/}
            message={<UploadMessage />}
            tip={"subtraction"}
        />
    );
}

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
        font-size: ${getFontSize("sm")};
        font-weight: ${getFontWeight("normal")};
        color: ${props => getColor({ color: "greyDark", theme: props.theme })};
    }
`;

/**
 * The styled upload message for uploading subtraction files
 */
function UploadMessage() {
    return (
        <MessageContainer>
            Drag FASTA files here to upload <span> Accepts files ending in fa, fasta, fa.gz, or fasta.gz.</span>
        </MessageContainer>
    );
}
