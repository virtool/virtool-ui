import React from "react";
import { connect } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Attribution, BoxSpaced, Icon, SlashList } from "../../base";
import { getCanModify } from "../../samples/selectors";
import { getWorkflowDisplayName } from "../../utils/utils";
import { removeAnalysis } from "../actions";
import { AnalysisItemRightIcon } from "./RightIcon";

const StyledAnalysisItem = styled(BoxSpaced)`
    color: ${props => props.theme.color.greyDarkest};

    &:hover {
        ${props => (props.ready ? "background-color: lightgrey;" : "")};
    }
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

function AnalysisItem({ canModify, created_at, id, index, ready, reference, subtractions, user, workflow, onRemove }) {
    const sampleId = useRouteMatch().params.sampleId;

    return (
        <StyledAnalysisItem>
            <AnalysisItemTop>
                <Link to={`/samples/${sampleId}/analyses/${id}`}>{getWorkflowDisplayName(workflow)}</Link>
                <AnalysisItemRightIcon canModify={canModify} onRemove={onRemove} ready={ready} />
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
        canModify: getCanModify(state)
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        onRemove: () => {
            dispatch(removeAnalysis(ownProps.id));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisItem);
