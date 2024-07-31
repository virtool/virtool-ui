import { BoxGroup, BoxGroupHeader } from "@base";
import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
import { IndexOTU as OTU } from "@indexes/types";
import { map } from "lodash-es";
import React from "react";
import IndexOTU from "./IndexOTU";

type IndexOTUsProps = {
    otus: OTU[];
    refId: string;
};

/**
 * A list of OTUs associated with the index
 */
export default function IndexOTUs({ otus, refId }: IndexOTUsProps) {
    const otuComponents = map(otus, otu => (
        <IndexOTU key={otu.id} refId={refId} name={otu.name} id={otu.id} changeCount={otu.change_count} />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    OTUs <BoxGroupHeaderBadge>{otus.length}</BoxGroupHeaderBadge>
                </h2>
            </BoxGroupHeader>
            {otuComponents}
        </BoxGroup>
    );
}
