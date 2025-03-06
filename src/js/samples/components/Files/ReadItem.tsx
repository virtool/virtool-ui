import { byteSize } from "@/utils";
import { BoxGroupSection } from "@base/index";
import React from "react";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";

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
                <div>
                    <a href={`/api/${download_url}`} download>
                        {name}
                    </a>
                </div>
            </ReadItemMain>
            {byteSize(size, true)}
        </StyledReadItem>
    );
}
