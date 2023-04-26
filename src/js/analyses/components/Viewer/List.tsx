import { findIndex } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { FixedSizeList } from "react-window";
import styled from "styled-components";
import { getBorder, getFontSize } from "../../../app/theme";
import { Key } from "../../../base";
import { setActiveHitId } from "../../actions";
import { getActiveHit, getHits, getMatches } from "../../selectors";
import { useKeyNavigation } from "./hooks";

const AnalysisViewerListHeader = styled.div`
    background-color: ${props => props.theme.color.greyLightest};
    border: 1px solid ${props => props.theme.color.greyLight};
    border-bottom: none;
    border-top-left-radius: ${props => props.theme.borderRadius.sm};
    border-top-right-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: 0 5px 5px -3px ${props => props.theme.color.greyLight};
    padding: 7px 15px;
    z-index: 20;
`;

const AnalysisViewerListFooter = styled.div`
    font-size: ${getFontSize("sm")};
    padding: 15px;
    text-align: center;
`;

const AnalysisViewerListWindow = styled(FixedSizeList)`
    border: ${getBorder};
    border-bottom-left-radius: ${props => props.theme.borderRadius.sm};
    border-bottom-right-radius: ${props => props.theme.borderRadius.sm};
    z-index: 10;
`;

type StyledAnalysisViewerListProps = {
    width: number;
};

const StyledAnalysisViewerList = styled.div<StyledAnalysisViewerListProps>`
    position: relative;
    width: ${props => props.width}px;
`;

export function AnalysisViewerList({
    activeId,
    children,
    itemSize,
    nextId,
    nextIndex,
    previousId,
    previousIndex,
    shown,
    total,
    width,
    onSetActiveId,
}) {
    const ref = useKeyNavigation(activeId, nextId, nextIndex, previousId, previousIndex, true, onSetActiveId);

    return (
        <StyledAnalysisViewerList width={width}>
            <AnalysisViewerListHeader>
                Showing {shown} of {total}
            </AnalysisViewerListHeader>
            <AnalysisViewerListWindow ref={ref} height={500} width={width} itemCount={shown} itemSize={itemSize}>
                {children}
            </AnalysisViewerListWindow>
            <AnalysisViewerListFooter>
                Use <Key>w</Key> and <Key>s</Key> to move
            </AnalysisViewerListFooter>
        </StyledAnalysisViewerList>
    );
}

function mapStateToProps(state) {
    const active = getActiveHit(state);
    const matches = getMatches(state);

    let nextId;
    let nextIndex;
    let previousId;
    let previousIndex;

    if (active) {
        const windowIndex = findIndex(matches, { id: active.id });

        if (windowIndex > 0) {
            previousIndex = windowIndex - 1;
            previousId = matches[previousIndex].id;
        }

        if (windowIndex < matches.length - 1) {
            nextIndex = windowIndex + 1;
            nextId = matches[nextIndex].id;
        }
    }
    return {
        activeId: active?.id,
        shown: matches.length,
        total: getHits(state).length,
        nextId,
        nextIndex,
        previousId,
        previousIndex,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSetActiveId: index => {
            dispatch(setActiveHitId(index));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalysisViewerList);
