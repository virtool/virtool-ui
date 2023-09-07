import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { BoxSpaced, Icon, Loader, RelativeTime } from "../../base";
import { byteSize } from "../../utils/utils";

import { useDeleteFile } from "../querys";
import { File as FileData } from "../types";

const FileAttribution = styled.span`
    font-size: ${getFontSize("md")};
`;

const FileHeader = styled.h5`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin: 0 0 5px;
`;

const FileHeaderIcon = styled.div`
    margin-left: auto;
`;

type FileProps = FileData & {
    canRemove: boolean;
};

export function File({ canRemove, id, name, ready, size, uploaded_at, user }: FileProps) {
    const { mutate: handleRemove } = useDeleteFile();

    const attribution =
        user === null ? (
            <FileAttribution>
                Retrieved <RelativeTime time={uploaded_at} />
            </FileAttribution>
        ) : (
            <FileAttribution>
                Uploaded <RelativeTime time={uploaded_at} /> by {user.handle}
            </FileAttribution>
        );

    const right = ready ? (
        <FileHeaderIcon>
            <span>{byteSize(size)}</span>
            {canRemove && (
                <Icon
                    name="trash"
                    color="red"
                    style={{ fontSize: "17px", marginLeft: "9px" }}
                    onClick={() => handleRemove(id)}
                    aria-label="delete"
                />
            )}
        </FileHeaderIcon>
    ) : (
        <FileHeaderIcon>
            <Loader size="14px" />
        </FileHeaderIcon>
    );

    return (
        <BoxSpaced>
            <FileHeader>
                <span>{name}</span>
                {right}
            </FileHeader>

            {attribution}
        </BoxSpaced>
    );
}
