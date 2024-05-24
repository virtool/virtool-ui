import React, { useCallback } from "react";
import { FileError, useDropzone } from "react-dropzone";
import styled, { DefaultTheme } from "styled-components";
import { getColor } from "../app/theme";
import { Button } from "./Button";
import { DividerVertical } from "./DividerVertical";

type getUploadBarColorProps = {
    /* Whether the user is able to drag/select files */
    active: boolean;
    theme: DefaultTheme;
};

function getUploadBarBackgroundColor({ active, theme }: getUploadBarColorProps): string {
    return active ? getColor({ color: "greyLightest", theme }) : "transparent";
}

function getUploadBarBorderColor({ active, theme }: getUploadBarColorProps): string {
    return getColor({ theme, color: active ? "blue" : "greyLight" });
}

type StyledUploadBarProps = {
    /* Whether the user is able to drag/select files */
    active: boolean;
};

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
    message?: React.ReactNode;
    /* Whether multiple files can be uploaded */
    multiple?: boolean;
    /* Callback when the upload bar loses focus */
    onBlur?: () => void;
    /* Callback when files are dropped */
    onDrop: (acceptedFiles: File[]) => void;
    /* Validates if a file is allowed */
    validator?: (file: File) => FileError;
};

/*
 * Allows files to be dragged and dropped or selected from the file system.
 */
export function UploadBar({
    message = "Drag file here to upload",
    multiple = true,
    onBlur,
    onDrop,
    validator,
}: UploadBarProps) {
    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            onDrop(acceptedFiles);
        },
        [onDrop],
    );

    const { getRootProps, getInputProps, isDragAccept, open } = useDropzone({ onDrop: handleDrop, validator });

    const rootProps = getRootProps({
        onClick: e => e.stopPropagation(),
    });

    return (
        <StyledUploadBar active={isDragAccept} {...rootProps}>
            <input {...getInputProps()} aria-label="Upload file" multiple={multiple} />
            <MessageContainer>{message}</MessageContainer>
            <UploadBarDivider text="or" />
            <ButtonContainer>
                <Button color="blue" icon="upload" onClick={open} onBlur={onBlur}>
                    Browse Files
                </Button>
            </ButtonContainer>
        </StyledUploadBar>
    );
}
