import React from "react";
import styled from "styled-components";
import FileManager from "../../files/components/Manager";
import { getColor, getFontSize, getFontWeight } from "../../app/theme";

export const SubtractionFileManager = () => (
    <FileManager
        fileType="subtraction"
        validationRegex={/\.(?:fa|fasta)(?:\.gz|\.gzip)?$/}
        message={<UploadMessage />}
    />
);

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

const UploadMessage = () => (
    <MessageContainer>
        Drag FASTA files here to upload <span> Accepts files ending in fa, fasta, fa.gz, or fasta.gz.</span>
    </MessageContainer>
);
