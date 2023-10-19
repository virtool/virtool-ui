import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
import { getColor, getFontSize, getFontWeight, sizes } from "../../app/theme";
import { Attribution, BoxSpaced, Icon, SlashList } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { getWorkflowDisplayName } from "../../utils/utils";
import { useRemoveAnalysis } from "../querys";
import { AnalysisMinimal } from "../types";
import { checkSupportedWorkflow } from "../utils";
import { AnalysisItemRightIcon } from "./RightIcon";

const StyledAnalysisItem = styled(BoxSpaced)`
    color: ${props => props.theme.color.greyDarkest};
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

const AnalysisItemTop = styled.div`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    justify-content: space-between;

    a {
        font-weight: ${getFontWeight("thick")};
    }
`;

const UnsupportedAnalysisTitle = styled.div`
    color: ${props => props.theme.color.black};
    i.fas {
        margin-left: 5px;
    }
    span {
        color: ${props => getColor({ color: "greyDark", theme: props.theme })};
        font-size: ${getFontSize("md")};
        margin-left: 5px;
        font-weight: ${getFontWeight("normal")};
    }
`;

/**
 * Condensed analysis item for use in a list of analyses
 */
export default function AnalysisItem({
    created_at,
    id,
    index,
    job,
    ready,
    reference,
    subtractions,
    user,
    workflow,
}: AnalysisMinimal) {
    const sampleId = useRouteMatch().params.sampleId;
    const { hasPermission: canModify } = useCheckAdminRole(AdministratorRoles.USERS);
    const onRemove = useRemoveAnalysis(id);

    const title = checkSupportedWorkflow(workflow) ? (
        <Link to={`/samples/${sampleId}/analyses/${id}`}>{getWorkflowDisplayName(workflow)}</Link>
    ) : (
        <UnsupportedAnalysisTitle>
            {getWorkflowDisplayName(workflow)}
            <span>Detailed view unavailable</span>
        </UnsupportedAnalysisTitle>
    );

    return (
        <StyledAnalysisItem>
            <AnalysisItemTop>
                {title}
                {ready ? (
                    <AnalysisItemRightIcon canModify={canModify} onRemove={onRemove} ready={ready} />
                ) : (
                    <ProgressCircle progress={job?.progress || 0} state={job?.state || "waiting"} size={sizes.md} />
                )}
            </AnalysisItemTop>
            <Attribution user={user.handle} time={created_at} />
            <AnalysisItemTags>
                <AnalysisItemTag key="reference">
                    <Icon name="equals" />
                    <SlashList>
                        <li>
                            <Link to={`/refs/${reference.id}`}>{reference.name}</Link>
                        </li>
                        <li>
                            <Link to={`/refs/${reference.id}/indexes/${index.id}`}>Index {index.version}</Link>
                        </li>
                    </SlashList>
                </AnalysisItemTag>
                {subtractions.map(subtraction => (
                    <AnalysisItemTag key={subtraction.id}>
                        <Icon name="not-equal" />
                        <Link to={`/subtractions/${subtraction.id}`}>{subtraction.name}</Link>
                    </AnalysisItemTag>
                ))}
            </AnalysisItemTags>
        </StyledAnalysisItem>
    );
}
