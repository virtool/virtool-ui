import { fontWeight } from "@app/theme";
import { BoxGroupSection } from "@base";
import { byteSize } from "@utils/utils";
import React from "react";
import styled from "styled-components";

const StyledSubtractionFile = styled(BoxGroupSection)`
    align-items: center;
    display: flex;

    a {
        margin-right: auto;
        font-weight: ${fontWeight.thick};
    }
`;

export type SubtractionFileItemProps = {
    downloadUrl: string;
    name: string;
    size: number;
};

export function SubtractionFileItem({
    downloadUrl,
    name,
    size,
}: SubtractionFileItemProps) {
    return (
        <StyledSubtractionFile>
            <a href={`/api${downloadUrl}`}>{name}</a>
            <strong>{byteSize(size)}</strong>
        </StyledSubtractionFile>
    );
}
