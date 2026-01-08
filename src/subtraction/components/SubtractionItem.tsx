import { getFontSize, getFontWeight, sizes } from "@app/theme";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import { JobNested } from "@jobs/types";
import styled from "styled-components";
import { SubtractionMinimal } from "../types";
import { SubtractionAttribution } from "./Attribution";

const StyledSubtractionItem = styled(BoxGroupSection)`
    align-items: center;
    display: grid;
    grid-template-columns: 30% 30% 30% auto;
    padding-bottom: 15px;
    padding-top: 15px;
    margin-left: auto;
    line-height: 1;
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
export function SubtractionItem({
    created_at,
    id,
    job,
    name,
    nickname,
    ready,
    user,
}: SubtractionMinimal) {
    const parsedJob = job && JobNested.parse(job);

    return (
        <StyledSubtractionItem>
            <SubtractionLink to={`/subtractions/${id}`}>{name}</SubtractionLink>
            <div>{nickname}</div>
            <Attribution>
                <SubtractionAttribution
                    handle={user.handle}
                    time={created_at}
                />
            </Attribution>
            {!ready && job && (
                <ProgressTag>
                    <ProgressCircle
                        size={sizes.md}
                        progress={parsedJob.progress}
                        state={parsedJob.state ?? "pending"}
                    />
                </ProgressTag>
            )}
        </StyledSubtractionItem>
    );
}
