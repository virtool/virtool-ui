import React from "react";
import styled from "styled-components";
import { fontWeight, getFontSize, sizes } from "../../app/theme";
import { Attribution, BoxLink, Icon } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { JobMinimal } from "../../jobs/types";
import { IndexMinimal } from "../types";

const StyledIndexItemDescription = styled.span`
    font-weight: ${fontWeight.normal};
`;

type IndexItemDescriptionProps = {
    changeCount: number;
    modifiedCount: number;
};

/**
 * Description of changes made since the last index build
 *
 * @param changeCount - The number of changes made since the last index build
 * @param modifiedCount - The number of OTUs modified since the last index build
 * @returns The index item's description
 */
export const IndexItemDescription = ({ changeCount, modifiedCount }: IndexItemDescriptionProps) => {
    if (changeCount === null) {
        return null;
    }

    if (changeCount === 0) {
        return <>No changes</>;
    }

    return (
        <StyledIndexItemDescription>
            {changeCount} change{changeCount === 1 ? "" : "s"} made in {modifiedCount} OTU
            {modifiedCount === 1 ? "" : "s"}
        </StyledIndexItemDescription>
    );
};

const IndexItemTop = styled.h3`
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${fontWeight.thick};
    margin: 0 0 5px;
`;

const StyledIndexItemIcon = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
`;

type IndexItemIconProps = {
    activeId: string;
    id: string;
    ready: boolean;
    job?: JobMinimal;
};
/**
 * Icon indicating that status of the index
 *
 * @param activeId - The id of the active index
 * @param id - The id of the index
 * @param ready - Whether the index is ready
 * @param job - The related job object
 * @returns The index item's icon
 */
export const IndexItemIcon = ({ activeId, id, ready, job }: IndexItemIconProps) => {
    if (ready) {
        if (id === activeId) {
            return (
                <StyledIndexItemIcon>
                    <Icon name="check" color="green" /> <span>Active</span>
                </StyledIndexItemIcon>
            );
        }

        return null;
    }

    return (
        <StyledIndexItemIcon>
            <ProgressCircle progress={job?.progress || 0} state={job?.state || "waiting"} size={sizes.md} />
            <span> Building</span>
        </StyledIndexItemIcon>
    );
};

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
