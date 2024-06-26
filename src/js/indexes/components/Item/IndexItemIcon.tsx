import React from "react";
import styled from "styled-components";
import { sizes } from "../../../app/theme";
import { Icon } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";
import { JobMinimal, JobState } from "../../../jobs/types";

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
export function IndexItemIcon({ activeId, id, ready, job }: IndexItemIconProps) {
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
            <ProgressCircle progress={job?.progress || 0} state={job?.state || JobState.waiting} size={sizes.md} />
            <span> Building</span>
        </StyledIndexItemIcon>
    );
}
