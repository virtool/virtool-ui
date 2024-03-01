import { includes } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";
import { BoxGroupSection } from "../../../base";
import { byteSize } from "../../../utils/utils";

function getFileIconName(name) {
    return includes(name, ".gz") ? "file-archive" : "file";
}

const ReadItemMain = styled.div`
    align-items: center;
    display: flex;
`;

const StyledReadItem = styled(BoxGroupSection)`
    align-items: flex-start;
    display: flex;
    font-weight: ${fontWeight.thick};
    justify-content: space-between;
`;

type ReadItemProps = {
    name: string;
    download_url: string;
    /** The size of the read file in bytes */
    size: number;
};

/**
 * A condensed read item for use in a list of reads
 */
export function ReadItem({ name, download_url, size }: ReadItemProps) {
    return (
        <StyledReadItem>
            <ReadItemMain>
                <i className={`fas fa-${getFileIconName(name)} fa-fw`} style={{ fontSize: "24px" }} />
                <div>
                    <a href={`/api/${download_url}`} download>
                        {name}
                    </a>
                </div>
            </ReadItemMain>
            {byteSize(size)}
        </StyledReadItem>
    );
}
