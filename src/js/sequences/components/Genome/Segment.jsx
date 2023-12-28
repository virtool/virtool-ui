import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize, getFontWeight } from "../../../app/theme";
import { Icon } from "../../../base";

const SequenceSegmentRequired = styled.span`
    align-items: center;
    display: flex;
    margin-left: auto;

    span {
        margin-left: 4px;
    }
`;

const StyledSelectItem = styled(RadixSelect.Item)`
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("thick")};
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

const StyledSequenceSegment = styled.div`
    align-items: center;
    display: flex;
    font-weight: ${fontWeight.thick};
    width: 100%;
`;

export const SequenceSegment = ({ name, required }) => (
    <StyledSelectItem value={name} key={name}>
        <RadixSelect.ItemText>
            <StyledSequenceSegment>
                <span>{name}</span>

                {required && (
                    <SequenceSegmentRequired>
                        <Icon name="exclamation-circle" />
                        <span>Required</span>
                    </SequenceSegmentRequired>
                )}
            </StyledSequenceSegment>
        </RadixSelect.ItemText>
    </StyledSelectItem>
);
