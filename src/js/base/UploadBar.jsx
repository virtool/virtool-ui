import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { getColor } from "../app/theme";
import { Button, VerticalDivider } from "./index";

const StyledUploadBar = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 10px 15px;
    margin-bottom: 15px;

    background-color: ${props =>
        props.active ? getColor({ color: "greyLightest", theme: props.theme }) : "transparent"};
    border: 1px solid ${props => getColor({ theme: props.theme, color: props.active ? "blue" : "greyLight" })};
    border-radius: ${props => props.theme.borderRadius.sm};
    cursor: pointer;

    button {
        margin: auto 0px;
    }
`;

const MessageContainer = styled.div`
    display: flex;
    flex 1 0 50px;
    justify-content: end;
    align-items: center;
    min-height: 60px;
    margin: auto 0;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex: 1 0 50px;
`;

const UploadBarDivider = styled(VerticalDivider)`
    margin: 0 40px;
    span {
        text-transform: uppercase;
    }
`;

export const UploadBar = ({ message, onDrop, validator }) => {
    const messageComponent = <MessageContainer>{message || "Drag file here to upload"}</MessageContainer>;

    const handleDrop = useCallback(acceptedFiles => {
        onDrop(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragAccept, open } = useDropzone({ onDrop: handleDrop, validator });

    const rootProps = getRootProps({
        onClick: e => e.stopPropagation()
    });

    return (
        <StyledUploadBar active={isDragAccept} {...rootProps}>
            <input {...getInputProps()} aria-label="Upload file" />
            {messageComponent}
            <UploadBarDivider text="or" justification="center" active={isDragAccept} />
            <ButtonContainer>
                <Button color="blue" icon="upload" onClick={open}>
                    Browse Files
                </Button>
            </ButtonContainer>
        </StyledUploadBar>
    );
};
