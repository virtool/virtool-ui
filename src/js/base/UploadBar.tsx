import React, { useCallback } from "react";
import { FileError, useDropzone } from "react-dropzone";
import styled, { DefaultTheme } from "styled-components/macro";
import { getColor } from "../app/theme";
import { Button } from "./Button";
import { DividerVertical } from "./DividerVertical";

type StyledUploadBarProps = {
    active: boolean;
};

type getUploadBarColorProps = {
    active: boolean;
    theme: DefaultTheme;
};

function getUploadBarBackgroundColor({ active, theme }: getUploadBarColorProps): string {
    return active ? getColor({ color: "greyLightest", theme }) : "transparent";
}

function getUploadBarBorderColor({ active, theme }: getUploadBarColorProps): string {
    return getColor({ theme, color: active ? "blue" : "greyLight" });
}

const StyledUploadBar = styled.div<StyledUploadBarProps>`
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 10px 15px;
    margin-bottom: 15px;

    background-color: ${getUploadBarBackgroundColor};
    border: 1px solid ${getUploadBarBorderColor};
    border-radius: ${props => props.theme.borderRadius.sm};
    cursor: pointer;

    button {
        margin: auto 0;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    flex: 1 0 50px;
    justify-content: end;
    align-items: center;
    min-height: 60px;
    margin: auto 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex: 1 0 50px;
`;

const UploadBarDivider = styled(DividerVertical)`
    margin: 0 40px;

    span {
        text-transform: uppercase;
    }
`;

type UploadBarProps = {
    message?: string;
    onDrop: (acceptedFiles: File[]) => void;
    validator?: (file: File) => FileError;
};

export const UploadBar = ({ message = "Drag file here to upload", onDrop, validator }: UploadBarProps) => {
    const handleDrop = useCallback(
        acceptedFiles => {
            onDrop(acceptedFiles);
        },
        [onDrop]
    );

    const { getRootProps, getInputProps, isDragAccept, open } = useDropzone({ onDrop: handleDrop, validator });

    const rootProps = getRootProps({
        onClick: e => e.stopPropagation()
    });

    return (
        <StyledUploadBar active={isDragAccept} {...rootProps}>
            <input {...getInputProps()} aria-label="Upload file" />
            <MessageContainer>{message}</MessageContainer>
            <UploadBarDivider text="or" />
            <ButtonContainer>
                <Button color="blue" icon="upload" onClick={open}>
                    Browse Files
                </Button>
            </ButtonContainer>
        </StyledUploadBar>
    );
};
