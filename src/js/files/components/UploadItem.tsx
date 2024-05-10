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

/**
 * Styled component for the title section of the upload item.
 * @param failed - whether the upload failed.
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
 * Styled component for the name of the upload item.
 */
const UploadItemName = styled.span`
    font-weight: ${getFontWeight("thick")};
`;

/**
 * Props definition for the UploadItem component.
 * @prop name - the name of the file being uploaded.
 * @prop progress - the progress of the upload in percentage.
 * @prop size - the size of the file being uploaded.
 * @prop failed - whether the upload failed.
 * @prop localId - the local id of the file being uploaded.
 * @prop onRemove - function to remove the file from the upload list.
 */
interface UploadItemProps {
    name: string;
    progress: number;
    size: number;
    failed: boolean;
    localId: string;
    onRemove: (localId: string) => void;
}

/**
 * Component representing an individual upload item.
 * @param {UploadItemProps} props - defined in the UploadItemProps interface.
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
