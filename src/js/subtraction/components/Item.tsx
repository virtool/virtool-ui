import React from "react";
import { connect } from "react-redux";
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
    id: string;
    user: UserNested;
    name: string;
    created_at: string;
    job: JobMinimal;
};

/**
 * Condensed subtraction item for use in a list of subtractions
 *
 * @param id - The unique subtraction id
 * @param user - The user who created the subtraction
 * @param name - The name of the subtraction
 * @param created_at - The date the subtraction was created
 * @param job - The job associated with the subtraction
 * @returns A condensed subtraction item
 */

export function SubtractionItem({ id, user, name, created_at, job }: SubtractionItemProps) {
    return (
        <BoxLink key={id} to={`/subtractions/${id}`}>
            <StyledSubtractionItemHeader>
                <span>{name}</span>
                <ProgressTag>
                    {job.state === "complete" || (
                        <ProgressCircle size={sizes.md} progress={job.progress} state={job.state} />
                    )}
                    {job.state === "complete" ? "Ready" : getStateTitle(job.state)}
                </ProgressTag>
            </StyledSubtractionItemHeader>
            <SubtractionAttribution handle={user.handle} time={created_at} />
        </BoxLink>
    );
}

/**
 * Extract information from redux state to pass as props to SubtractionItem
 *
 * @param state - The complete current redux state
 * @param props - The props passed to the SubtractionItem component
 * @returns The props derived from redux state
 */
export function mapStateToProps(state, props) {
    const { id, user, name, created_at, job } = state.subtraction.documents[props.index];
    return {
        id,
        user,
        created_at,
        name,
        job,
    };
}

export default connect(mapStateToProps)(SubtractionItem);
