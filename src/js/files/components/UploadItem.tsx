import React from "react";
import styled from "styled-components";
import { getBorder, getColor, getFontWeight } from "../../app/theme";
import { Icon, Loader, ProgressBarAffixed } from "../../base";
import { byteSize } from "../../utils/utils";

/**
 * Styled component for the upload item container.
 */
const StyledUploadItem = styled.div`
    padding: 0;
    position: relative;

    &:not(:last-child) {
        border-bottom: ${getBorder};
    }
`;

type UploadItemTitleProps = {
     /** whether the upload failed. */
     failed: boolean
}

/** 
Styled component for the title section of the upload item. 
*/
const UploadItemTitle = styled.div<{ failed: boolean }>`
    justify-content: space-between;
    display: flex;
    padding: 15px 15px 10px;

    i.fas,
    div:first-child {
        margin-right: 5px;
    }
    span:last-child {
        margin-left: auto;
        color: ${props => (props.failed ? getColor({ theme: props.theme, color: "red" }) : "inherit")};
    }
    i.fa-times {
        font-size: 20px;
    }
    i.fa-trash {
        margin-left: 5px;
        font-size: 14px;
    }
`;

/**
 * Emphasized name of the upload item.
 */
const UploadItemName = styled.span`
    font-weight: ${getFontWeight("thick")};
`;

type UploadItemProps = {
    /* Name of the file being uploaded */
    name: string;
    /* Progress of the upload in percentage */
    progress: number;
    /* Size of the file being uploaded */
    size: number;
    /* Whether the upload failed */
    failed: boolean;
    /* Local id of the file being uploaded */
    localId: string;
    /* Function to remove the file from the upload list */
    onRemove: (localId: string) => void;
};

/**
 * Progress tracker for a single uploaded file
 */
export function UploadItem({ name, progress, size, failed, localId, onRemove }: UploadItemProps): JSX.Element {
    let uploadIcon = progress === 100 ? <Loader size="14px" /> : <Icon name="upload" />;
    let uploadBookend: React.ReactNode = byteSize(size, true);

    if (failed) {
        uploadIcon = <Icon name="times" color="red" hoverable={false} />;
        uploadBookend = (
            <>
                Failed <Icon aria-label={`delete ${name}`} name="trash" color="red" onClick={() => onRemove(localId)} />
            </>
        );
    }

    return (
        <StyledUploadItem>
            <ProgressBarAffixed now={failed ? 100 : progress} color={failed ? "red" : "blue"} />
            <UploadItemTitle failed={failed}>
                {uploadIcon}
                <UploadItemName>{name}</UploadItemName>
                <span>{uploadBookend}</span>
            </UploadItemTitle>
        </StyledUploadItem>
    );
}
