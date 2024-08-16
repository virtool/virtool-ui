import { Badge, BoxGroupSection } from "@base";
import { cn } from "@utils/utils";
import React from "react";
import { Link } from "react-router-dom";

type IndexOTUProps = {
    refId: string;
    /** The quantity of changes made to this otu since last index build */
    changeCount: number;
    id: string;
    name: string;
};

/**
 * A condensed index OTU item for use in a list of index OTUs
 */
export default function IndexOTU({ refId, changeCount, id, name }: IndexOTUProps) {
    return (
        <BoxGroupSection className={cn("flex", "justify-between")}>
            <Link to={`/refs/${refId}/otus/${id}`}>{name}</Link>
            <Badge>
                {changeCount} {`change${changeCount > 1 ? "s" : ""}`}
            </Badge>
        </BoxGroupSection>
    );
}
