import { BoxGroupHeader, NoneFoundSection } from "@/base";
import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import Contributor from "@indexes/components/Contributor";
import { IndexContributor } from "@indexes/types";
import { map, sortBy } from "lodash-es";
import React from "react";

type ContributorsProps = {
    contributors: IndexContributor[];
};

/**
 * A list of contributors for the index
 */
export default function Contributors({ contributors }: ContributorsProps) {
    const sorted = sortBy(contributors, ["id", "count"]);

    let contributorComponents = map(sorted, (contributor) => (
        <Contributor key={contributor.id} {...contributor} />
    ));

    if (contributorComponents.length === 0) {
        contributorComponents = <NoneFoundSection noun="contributors" />;
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 className="flex gap-2">
                    <span>Contributors</span>
                    <Badge>{contributors.length}</Badge>
                </h2>
            </BoxGroupHeader>
            {contributorComponents}
        </BoxGroup>
    );
}
