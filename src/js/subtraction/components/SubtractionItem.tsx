import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight, sizes } from "../../app/theme";
import { BoxGroupSection } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { getStateTitle } from "../../jobs/utils";
import { SubtractionMinimal } from "../types";
import { SubtractionAttribution } from "./Attribution";

const StyledSubtractionItem = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 45% 25% auto;
    padding-bottom: 15px;
    padding-top: 15px;
    margin-left: auto;
    line-height: 1;
`;

const SubtractionNickname = styled.div`
    //font-size: ${getFontSize("lg")};
`;

const StyledSubtractionItemHeader = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
`;

const SubtractionLink = styled(Link)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const ProgressTag = styled.span`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`;

/**
 * A condensed subtraction item for use in a list of subtractions
 */
export function SubtractionItem({ created_at, id, job, name, nickname, ready, user }: SubtractionMinimal) {
    return (
        <StyledSubtractionItem>
            <SubtractionLink to={`/subtractions/${id}`}>{name}</SubtractionLink>
            <SubtractionNickname>{nickname}</SubtractionNickname>
            <StyledSubtractionItemHeader>
                {ready ? (
                    <SubtractionAttribution handle={user.handle} time={created_at} />
                ) : (
                    <ProgressTag>
                        <ProgressCircle size={sizes.md} progress={job?.progress ?? 0} state={job?.state ?? "waiting"} />
                        {getStateTitle(job?.state)}
                    </ProgressTag>
                )}
            </StyledSubtractionItemHeader>
        </StyledSubtractionItem>
    );
}
