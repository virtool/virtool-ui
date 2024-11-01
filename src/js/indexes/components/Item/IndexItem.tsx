import React from "react";
import { Attribution, BoxGroupSection, Link } from "@base";
import { IndexMinimal } from "../../types";
import { IndexItemDescription } from "./IndexItemDescription";
import { IndexItemIcon } from "./IndexItemIcon";

type IndexItemProps = {
    activeId: string;
    index: IndexMinimal;
    refId: string;
};

/**
 * A single index item in the list of indexes.
 *
 * @param activeId - The id of the active index
 * @param index - The index
 * @param refId - The id of the parent reference
 * @return The index item
 */

export function IndexItem({ activeId, index, refId }: IndexItemProps) {
    return (
        <BoxGroupSection>
            <h3 className="grid grid-cols-3 mb-2 text-lg">
                <Link className="font-medium" to={`/refs/${refId}/indexes/${index.id}`}>
                    Version {index.version}
                </Link>
                <IndexItemDescription changeCount={index.change_count} modifiedCount={index.modified_otu_count} />
                <IndexItemIcon activeId={activeId} id={index.id} ready={index.ready} job={index.job} />
            </h3>
            <Attribution time={index.created_at} user={index.user.handle} />
        </BoxGroupSection>
    );
}
