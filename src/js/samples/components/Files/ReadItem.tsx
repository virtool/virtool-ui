import { BoxGroupSection } from "@base";
import { byteSize, cn } from "@utils/utils";
import React from "react";
import styled from "styled-components";

const ReadItemMain = styled.div`
    align-items: center;
    display: flex;
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
        <BoxGroupSection className={cn("flex", "items-start", "justify-between", "font-medium")}>
            <ReadItemMain>
                <div>
                    <a href={`/api/${download_url}`} download>
                        {name}
                    </a>
                </div>
            </ReadItemMain>
            {byteSize(size, true)}
        </BoxGroupSection>
    );
}
