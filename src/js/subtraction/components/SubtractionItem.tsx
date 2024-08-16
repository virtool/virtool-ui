import { getFontSize, getFontWeight, sizes } from "@app/theme";
import { BoxGroupSection, ProgressCircle } from "@base";
import { JobState } from "@jobs/types";
import { cn } from "@utils/utils";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SubtractionMinimal } from "../types";
import { SubtractionAttribution } from "./Attribution";

const SubtractionLink = styled(Link)`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const ProgressTag = styled.span`
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    display: flex;
    align-items: center;
    justify-content: flex-end;
    svg {
        margin-right: 5px;
    }
`;

const Attribution = styled.div`
    display: flex;
    justify-content: flex-start;
`;

/**
 * A condensed subtraction item for use in a list of subtractions
 */
export function SubtractionItem({ created_at, id, job, name, nickname, ready, user }: SubtractionMinimal) {
    return (
        <BoxGroupSection
            className={cn("items-center", "grid", "grid-cols-[30%_30%_30%_auto]", "ml-auto", "leading-none", "py-4")}
        >
            <SubtractionLink to={`/subtractions/${id}`}>{name}</SubtractionLink>
            <div>{nickname}</div>
            <Attribution>
                <SubtractionAttribution handle={user.handle} time={created_at} />
            </Attribution>
            {!ready && (
                <ProgressTag>
                    <ProgressCircle
                        size={sizes.md}
                        progress={job?.progress ?? 0}
                        state={job?.state ?? JobState.waiting}
                    />
                </ProgressTag>
            )}
        </BoxGroupSection>
    );
}
