import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Attribution, BoxGroupSection, Icon, Loader, RelativeTime } from "../../base";
import { byteSize } from "../../utils/utils";

import { useDeleteFile } from "../queries";
import { File as FileData } from "../types";

const FileItem = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 35% 35% auto;
    padding-bottom: 15px;
    padding-top: 15px;
    margin-left: auto;
    line-height: 1;
`;

const FileHeader = styled.div`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const FileAttribution = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const FileHeaderIcon = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

type FileProps = FileData & {
    canRemove: boolean;
};

export function File({ canRemove, id, name, ready, size, uploaded_at, user }: FileProps) {
    const { mutate: handleRemove } = useDeleteFile();

    return (
        <FileItem>
            <FileHeader>
                <span>{name}</span>
            </FileHeader>

            {user === null ? (
                <FileAttribution>
                    Retrieved <RelativeTime time={uploaded_at} />
                </FileAttribution>
            ) : (
                <FileAttribution>
                    <Attribution time={uploaded_at} user={user.handle} />
                </FileAttribution>
            )}

            <FileHeaderIcon>
                {ready ? (
                    <>
                        <span>{byteSize(size, true)}</span>
                        {canRemove && (
                            <Icon
                                name="trash"
                                color="red"
                                style={{ fontSize: "17px", marginLeft: "40px" }}
                                onClick={() => handleRemove(id)}
                                aria-label="delete"
                            />
                        )}
                    </>
                ) : (
                    <Loader size="14px" />
                )}
            </FileHeaderIcon>
        </FileItem>
    );
}
