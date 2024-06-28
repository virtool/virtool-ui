import { fontWeight } from "@app/theme";
import { SelectItem } from "@base";
import React from "react";
import styled from "styled-components";

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
        <SelectItem value={name} key={name} description="">
            <StyledSequenceTarget>
                <h5>{name}</h5>
                <p>{description || <em>No Description</em>}</p>
            </StyledSequenceTarget>
        </SelectItem>
    );
}
