import Badge from "../../base/Badge";
import BoxGroup from "../../base/BoxGroup";
import BoxGroupHeader from "../../base/BoxGroupHeader";
import { IndexOTU as OTU } from "../types";
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
    const otuComponents = map(otus, (otu) => (
        <IndexOTU
            key={otu.id}
            refId={refId}
            name={otu.name}
            id={otu.id}
            changeCount={otu.change_count}
        />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2 className="flex items-center gap-2">
                    OTUs
                    <Badge>{otus.length}</Badge>
                </h2>
            </BoxGroupHeader>
            {otuComponents}
        </BoxGroup>
    );
}
