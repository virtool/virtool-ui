import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import { fontWeight, getColor, getFontSize, getFontWeight } from "../../../app/theme";

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

const StyledSequenceTarget = styled.div`
    padding: 5px;

    h5 {
        text-align: start;
        font-weight: ${fontWeight.thick};
        margin: 0 0 3px 0;
    }

    p {
        font-weight: ${fontWeight.normal};
        margin: 0;
    }
`;

type SequenceTargetProps = {
    /** The name of the target */
    name: string;
    /** The description of the target */
    description: string;
};

/**
 * A condensed sequence target for use in a list of targets
 */
export function SequenceTarget({ name, description }: SequenceTargetProps) {
    return (
        <StyledSelectItem value={name} key={name}>
            <RadixSelect.ItemText>
                <StyledSequenceTarget>
                    <h5>{name}</h5>
                    <p>{description || <em>No Description</em>}</p>
                </StyledSequenceTarget>
            </RadixSelect.ItemText>
        </StyledSelectItem>
    );
}
