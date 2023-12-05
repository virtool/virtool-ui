import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight, sizes } from "../../app/theme";
import { BoxLink } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { JobMinimal } from "../../jobs/types";
import { getStateTitle } from "../../jobs/utils";
import { UserNested } from "../../users/types";
import { SubtractionAttribution } from "./Attribution";

const StyledSubtractionItemHeader = styled.div`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};

    > span:last-child {
        margin-left: auto;
    }
`;

const ProgressTag = styled.span`
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`;

type SubtractionItemProps = {
    /** The date the subtraction was created */
    created_at: string;
    /** The unique subtraction id */
    id: string;
    /** The job associated with the subtraction */
    job?: JobMinimal;
    /** The name of the subtraction */
    name: string;
    /** Whether the associated job is complete */
    ready: boolean;
    /** The user who created the subtraction */
    user: UserNested;
};

/**
 * A condensed subtraction item for use in a list of subtractions
 */
export function SubtractionItem({ created_at, id, job, name, ready, user }: SubtractionItemProps) {
    return (
        <BoxLink key={id} to={`/subtractions/${id}`}>
            <StyledSubtractionItemHeader>
                <span>{name}</span>
                <ProgressTag>
                    {ready || (
                        <>
                            <ProgressCircle
                                size={sizes.md}
                                progress={job?.progress ?? 0}
                                state={job?.state ?? "waiting"}
                            />
                            {getStateTitle(job?.state)}
                        </>
                    )}
                </ProgressTag>
            </StyledSubtractionItemHeader>
            <SubtractionAttribution handle={user.handle} time={created_at} />
        </BoxLink>
    );
}
