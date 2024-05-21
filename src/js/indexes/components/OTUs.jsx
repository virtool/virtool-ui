import { map } from "lodash-es";
import React from "react";
import { Badge, BoxGroup, BoxGroupHeader } from "../../base";
import { IndexOTU } from "./OTU";

export default function IndexOTUs({ otus, refId }) {
    const otuComponents = map(otus, otu => (
        <IndexOTU key={otu.id} refId={refId} name={otu.name} id={otu.id} changeCount={otu.change_count} />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    OTUs <Badge>{otus.length}</Badge>
                </h2>
            </BoxGroupHeader>
            {otuComponents}
        </BoxGroup>
    );
}
