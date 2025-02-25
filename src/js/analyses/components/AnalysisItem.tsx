import { JobState } from "@jobs/types";
import React from "react";
import styled from "styled-components";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { getColor, getFontSize, getFontWeight, sizes } from "../../app/theme";
import { Attribution, Box, Icon, Link, SlashList } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { getWorkflowDisplayName } from "../../utils/utils";
import { useRemoveAnalysis } from "../queries";
import { AnalysisMinimal } from "../types";
import { checkSupportedWorkflow } from "../utils";
import { AnalysisItemRightIcon } from "./AnalysisItemRightIcon";

const StyledAnalysisItem = styled(Box)`
    color: ${(props) => props.theme.color.greyDarkest};
    margin-bottom: 10px;
`;

const AnalysisItemTag = styled.span`
    align-items: center;
    display: inline-flex;
    margin-right: 15px;

    ${SlashList} {
        margin: 0;
    }

    i {
        margin-right: 5px;
    }
`;

const AnalysisItemTags = styled.div`
    align-items: center;
    display: flex;
    margin-top: 10px;
`;

const AnalysisItemEndIcon = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const AnalysisItemTop = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: 40% 40% auto;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};

    a {
        font-weight: ${getFontWeight("thick")};
    }
`;

const AnalysisAttribution = styled(Attribution)`
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("normal")};
`;

const UnsupportedAnalysisTitle = styled.div`
    color: ${(props) => props.theme.color.black};
    i.fas {
        margin-left: 5px;
    }
    span {
        color: ${(props) =>
            getColor({ color: "greyDark", theme: props.theme })};
        font-size: ${getFontSize("md")};
        margin-left: 5px;
        font-weight: ${getFontWeight("normal")};
    }
`;

type AnalysisItemProps = {
    analysis: AnalysisMinimal;
};

/**
 * Condensed analysis item for use in a list of analyses
 */
export default function AnalysisItem({ analysis }: AnalysisItemProps) {
    const {
        id,
        workflow,
        ready,
        job,
        user,
        reference,
        index,
        subtractions,
        created_at,
    } = analysis;
    const { hasPermission: canModify } = useCheckAdminRole(
        AdministratorRoles.USERS,
    );
    const onRemove = useRemoveAnalysis(id);

    const title = checkSupportedWorkflow(workflow) ? (
        <Link to={`/samples/${analysis.sample.id}/analyses/${id}`}>
            {getWorkflowDisplayName(workflow)}
        </Link>
    ) : (
        <UnsupportedAnalysisTitle>
            {getWorkflowDisplayName(workflow)}
            <span>Workflow unavailable</span>
        </UnsupportedAnalysisTitle>
    );

    return (
        <StyledAnalysisItem>
            <AnalysisItemTop>
                {title}
                <AnalysisAttribution user={user.handle} time={created_at} />
                <AnalysisItemEndIcon>
                    {ready ? (
                        <AnalysisItemRightIcon
                            canModify={canModify}
                            onRemove={onRemove}
                        />
                    ) : (
                        <ProgressCircle
                            progress={job?.progress || 0}
                            state={job?.state || JobState.waiting}
                            size={sizes.md}
                        />
                    )}
                </AnalysisItemEndIcon>
            </AnalysisItemTop>
            <AnalysisItemTags>
                <AnalysisItemTag key="reference">
                    <Icon name="equals" />
                    <SlashList>
                        <li>
                            <Link to={`/refs/${reference.id}`}>
                                {reference.name}
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={`/refs/${reference.id}/indexes/${index.id}`}
                            >
                                Index {index.version}
                            </Link>
                        </li>
                    </SlashList>
                </AnalysisItemTag>
                {subtractions.map((subtraction) => (
                    <AnalysisItemTag key={subtraction.id}>
                        <Icon name="not-equal" />
                        <Link to={`/subtractions/${subtraction.id}`}>
                            {subtraction.name}
                        </Link>
                    </AnalysisItemTag>
                ))}
            </AnalysisItemTags>
        </StyledAnalysisItem>
    );
}
