import { fontWeight, getColor, getFontSize, getFontWeight } from "@app/theme";
import { Icon } from "@base";
import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";

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

    &:hover {
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

type SequenceSegmentProps = {
    /** The name of the segment */
    name: string;
    /** Whether the segment is required */
    required: boolean;
};

/**
 * A condensed sequence segment for use in a list of segments
 */
export function SequenceSegment({ name, required }: SequenceSegmentProps) {
    return (
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
}
