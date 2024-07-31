import { Badge, BoxGroupSection, InitialIcon } from "@base";
import React from "react";
import styled from "styled-components";

const StyledContributor = styled(BoxGroupSection)`
    display: flex;
    align-items: center;
    .InitialIcon {
        margin-right: 5px;
    }
`;

type ContributorProps = {
    id: string;
    count: number;
    handle: string;
};

/**
 * A condensed contributor item for use in a list of contributors
 */
export default function Contributor({ id, count, handle }: ContributorProps) {
    return (
        <StyledContributor key={id}>
            <InitialIcon handle={handle} size="md" />
            {handle}
            <Badge className="ml-auto">
                {count} change{count === 1 ? "" : "s"}
            </Badge>
        </StyledContributor>
    );
}
