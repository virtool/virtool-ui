import { getBorder, getColor, theme } from "@app/theme";
import { Icon, Loader, ProgressBarAffixed } from "@base";
import { useUploaderStore } from "@files/uploader";
import { byteSize } from "@utils/utils";
import React from "react";
import styled from "styled-components";

/**
 * Container for the upload item.
 */
const StyledUploadItem = styled.div`
    padding: 0;
    position: relative;

    &:not(:last-child) {
        border-bottom: ${getBorder};
    }
`;

type UploadItemTitleProps = {
    /** Whether the upload failed */
    failed: boolean;
};

/**
 * Container for the title section of the upload item.
 */
const UploadItemTitle = styled.div<UploadItemTitleProps>`
    justify-content: space-between;
    display: flex;
    padding: 15px 15px 10px;

    i.fas,
    div:first-child {
        margin-right: 5px;
    }
    span:last-child {
        margin-left: auto;
        color: ${props => (props.failed ? getColor({ theme: theme, color: "red" }) : "inherit")};
    }
    i.fa-times {
        font-size: 20px;
    }
    i.fa-trash {
        margin-left: 5px;
        font-size: 14px;
    }
`;

type UploadItemProps = {
    /* Whether the upload failed */
    failed: boolean;
    /* Local id of the file being uploaded */
    localId: string;
    /* Name of the file being uploaded */
    name: string;
    /* Progress of the upload in percentage */
    progress: number;
    /* Size of the file being uploaded */
    size: number;
};

/**
 * Progress tracker for a single uploaded file
 */
export function UploadItem({ failed, localId, name, progress, size }: UploadItemProps): JSX.Element {
    const removeUpload = useUploaderStore(state => state.removeUpload);

    let uploadIcon = progress === 100 ? <Loader size="14px" /> : <Icon name="upload" />;
    let uploadBookend: React.ReactNode = byteSize(size, true);

    if (failed) {
        uploadIcon = <Icon name="times" color="red" hoverable={false} />;
        uploadBookend = (
            <>
                Failed{" "}
                <Icon aria-label={`delete ${name}`} name="trash" color="red" onClick={() => removeUpload(localId)} />
            </>
        );
    }

    return (
        <StyledUploadItem>
            <ProgressBarAffixed now={failed ? 100 : progress} color={failed ? "red" : "blue"} />
            <UploadItemTitle failed={failed}>
                {uploadIcon}
                <span className="font-medium">{name}</span>
                <span>{uploadBookend}</span>
            </UploadItemTitle>
        </StyledUploadItem>
    );
}
