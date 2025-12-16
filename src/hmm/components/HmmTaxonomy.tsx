import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import { sortBy } from "es-toolkit";
import styled from "styled-components";

const HmmTaxonomyItem = styled(BoxGroupSection)`
    display: flex;
    justify-content: space-between;
`;

const StyledHmmTaxonomy = styled(BoxGroupSection)`
    max-height: 210px;
    overflow-y: auto;
    padding: 0;
`;

type HmmTaxonomyProps = {
    /** The names and corresponding counts of the taxonomy items */
    counts: { [key: string]: number };
    /** The title to be displayed */
    title: string;
};

/**
 * Displays a list of taxonomy items
 */
export function HmmTaxonomy({ counts, title }: HmmTaxonomyProps) {
    const sorted = sortBy(
        Object.entries(counts).map(([name, count]) => ({ name, count })),
        ["name"],
    );

    const components = sorted.map(({ name, count }) => (
        <HmmTaxonomyItem key={name}>
            {name} <Badge>{count}</Badge>
        </HmmTaxonomyItem>
    ));

    return (
        <div>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>{title}</h2>
                </BoxGroupHeader>
                <StyledHmmTaxonomy>{components}</StyledHmmTaxonomy>
            </BoxGroup>
        </div>
    );
}
