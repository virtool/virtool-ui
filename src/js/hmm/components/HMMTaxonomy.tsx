import { Badge, BoxGroup, BoxGroupHeader, BoxGroupSection } from "@base";
import { cn } from "@utils/utils";
import { map, sortBy } from "lodash-es";
import React from "react";

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
        <BoxGroupSection className={cn("flex", "justify-between")} key={name}>
            {name} <Badge>{count}</Badge>
        </BoxGroupSection>
    ));

    return (
        <div>
            <BoxGroup>
                <BoxGroupHeader>
                    <h2>{title}</h2>
                </BoxGroupHeader>
                <BoxGroupSection className={cn("max-h-52", "overflow-y-auto", "p-0")}>{components}</BoxGroupSection>
            </BoxGroup>
        </div>
    );
}
