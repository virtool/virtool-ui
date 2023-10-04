import React from "react";
import { connect } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight, sizes } from "../../app/theme";
import { Attribution, BoxSpaced, Icon, SlashList } from "../../base";
import { ProgressCircle } from "../../base/ProgressCircle";
import { getCanModify } from "../../samples/selectors";
import { getWorkflowDisplayName } from "../../utils/utils";
import { useRemoveAnalysis } from "../querys";
import { AnalysisMinimal } from "../types";
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

/**
 * Condensed analysis item for use in a list of analyses
 *
 * @param created_at - The date the analysis was created
 * @param id - The unique identifier of the analysis
 * @param index - Index associated with the analysis
 * @param ready - Whether the analysis is ready
 * @param reference - Reference associated with the analysis
 * @param subtractions - Subtraction associated with the analysis
 * @param user - User who created the analysis
 * @param workflow - Workflow associated with the analysis
 * @param job - Job associated with the analysis
 * @param canModify - Whether the user can modify the analysis
 */
function AnalysisItem({
    created_at,
    id,
    index,
    ready,
    reference,
    subtractions,
    user,
    workflow,
    job,
    canModify,
}: AnalysisMinimal) {
    const sampleId = useRouteMatch().params.sampleId;

    const mutation = useRemoveAnalysis();

    const onRemove = () => {
        mutation.mutate({ analysisId: id });
    };

    return (
        <StyledAnalysisItem>
            <AnalysisItemTop>
                <Link to={`/samples/${sampleId}/analyses/${id}`}>{getWorkflowDisplayName(workflow)}</Link>
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

export function mapStateToProps(state) {
    return {
        canModify: getCanModify(state),
    };
}

export default connect(mapStateToProps)(AnalysisItem);
