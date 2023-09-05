import React from "react";
import styled from "styled-components";
import { fontWeight } from "../../../app/theme";
import { BoxGroupSection } from "../../../base";
import { byteSize } from "../../../utils/utils";

const StyledSubtractionFile = styled(BoxGroupSection)`
    align-items: center;
    display: flex;

    a {
        margin-right: auto;
        font-weight: ${fontWeight.thick};
    }
`;

export const File = ({ file: { download_url, name, size } }) => (
    <StyledSubtractionFile>
        <a href={`/api${download_url}`}>{name}</a>
        <strong>{byteSize(size)}</strong>
    </StyledSubtractionFile>
);
