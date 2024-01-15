import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, getFontWeight } from "../../app/theme";

const StyledSelectItem = styled(RadixSelect.Item)`
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 35px 5px 25px;
    position: relative;
    user-select: none;
    margin-bottom: 5px;
    text-transform: capitalize;

    :hover {
        background-color: ${({ theme }) => getColor({ color: "greyHover", theme })};
        border: 0;
    }
`;

export function SelectItem({ value, children }) {
    return (
        <StyledSelectItem value={value} key={value}>
            {children}
        </StyledSelectItem>
    );
}
