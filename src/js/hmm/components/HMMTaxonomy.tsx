import { map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection } from "../../base";

const HMMTaxonomyItem = styled(BoxGroupSection)`
    display: flex;

    ${Badge} {
        margin-left: auto;
    }
`;

const StyledHMMTaxonomy = styled(BoxGroupSection)`
    max-height: 210px;
    overflow-y: auto;
    padding: 0;
`;

type HMMTaxonomyProps = {
    /** The names and corresponding counts of the taxonomy items */
    counts: { [key: string]: number };
    /** The title to be displayed */
    title: string;
};

/**
 * Displays a list of taxonomy items
 */
export function HMMTaxonomy({ counts, title }: HMMTaxonomyProps) {
    const sorted = sortBy(
        map(counts, (count, name) => ({ name, count })),
        "name"
    );

    const components = map(sorted, ({ name, count }) => (
        <HMMTaxonomyItem key={name}>
            {name} <Badge>{count}</Badge>
        </HMMTaxonomyItem>
    ));

    return (
        <div>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>{title}</h2>
                </BoxGroupHeader>
                <StyledHMMTaxonomy>{components}</StyledHMMTaxonomy>
            </BoxGroup>
        </div>
    );
}
