import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import { getColor, getFontSize, getFontWeight } from "../app/theme";

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

    &:hover {
        background-color: ${({ theme }) =>
            getColor({ color: "greyHover", theme })};
        border: 0;
    }
`;

const Description = styled.div`
    font-size: ${getFontSize("sm")};
    font-weight: ${getFontWeight("normal")};
    color: ${({ theme }) => getColor({ color: "greyDarkest", theme })};
    margin-top: 5px;
    white-space: pre-wrap;
`;

export default function SelectItem({ value, children, description }) {
    return (
        <StyledSelectItem value={value} key={value}>
            <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
            {description && <Description>{description}</Description>}
        </StyledSelectItem>
    );
}
