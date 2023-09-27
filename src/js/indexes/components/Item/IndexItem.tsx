import React from "react";
import styled from "styled-components";
import { fontWeight, getFontSize } from "../../../app/theme";
import { Attribution, BoxLink } from "../../../base";
import { IndexMinimal } from "../../types";
import { IndexItemDescription } from "./IndexItemDescription";
import { IndexItemIcon } from "./IndexItemIcon";

const IndexItemTop = styled.h3`
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${fontWeight.thick};
    margin: 0 0 5px;
`;

const IndexItemVersion = styled.strong`
    flex: 1 0 auto;
    font-weight: ${fontWeight.thick};
    max-width: 40%;
`;

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
        <BoxLink to={`/refs/${refId}/indexes/${index.id}`}>
            <IndexItemTop>
                <IndexItemVersion>Version {index.version}</IndexItemVersion>
                <IndexItemDescription changeCount={index.change_count} modifiedCount={index.modified_otu_count} />
                <IndexItemIcon activeId={activeId} id={index.id} ready={index.ready} job={index.job} />
            </IndexItemTop>
            <Attribution time={index.created_at} user={index.user.handle} />
        </BoxLink>
    );
}
