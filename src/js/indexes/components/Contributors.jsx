import { map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection, InitialIcon, NoneFoundSection } from "../../base";

const StyledContributor = styled(BoxGroupSection)`
    display: flex;
    align-items: center;
    .InitialIcon {
        margin-right: 5px;
    }
    ${Badge} {
        margin-left: auto;
    }
`;

export const Contributor = ({ id, count, handle }) => (
    <StyledContributor key={id}>
        <InitialIcon handle={handle} size="md" />
        {handle}
        <Badge>
            {count} change{count === 1 ? "" : "s"}
        </Badge>
    </StyledContributor>
);

export default function Contributors({ contributors }) {
    const sorted = sortBy(contributors, ["id", "count"]);

    let contributorComponents = map(sorted, contributor => <Contributor key={contributor.id} {...contributor} />);

    if (contributorComponents.length === 0) {
        contributorComponents = <NoneFoundSection noun="contributors" />;
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    Contributors <Badge>{contributors.length}</Badge>
                </h2>
            </BoxGroupHeader>
            {contributorComponents}
        </BoxGroup>
    );
}
