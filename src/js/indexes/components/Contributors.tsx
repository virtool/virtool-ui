import { BoxGroup, BoxGroupHeader, NoneFoundSection } from "@base";
import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
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

    let contributorComponents = map(sorted, contributor => <Contributor key={contributor.id} {...contributor} />);

    if (contributorComponents.length === 0) {
        contributorComponents = <NoneFoundSection noun="contributors" />;
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    Contributors <BoxGroupHeaderBadge>{contributors.length}</BoxGroupHeaderBadge>
                </h2>
            </BoxGroupHeader>
            {contributorComponents}
        </BoxGroup>
    );
}
