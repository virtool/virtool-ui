import { useGetActiveHit } from "@/analyses/hooks";
import { FormattedNuvsHit } from "@/analyses/types";
import { getBorder, getFontSize } from "@app/theme";
import { Key } from "@/base";
import { useUrlSearchParam } from "@utils/hooks";
import { findIndex } from "lodash-es";
import React from "react";
import { FixedSizeList } from "react-window";
import styled from "styled-components";
import { useKeyNavigation } from "./hooks";

const AnalysisViewerListHeader = styled.div`
    background-color: ${(props) => props.theme.color.greyLightest};
    border: 1px solid ${(props) => props.theme.color.greyLight};
    border-bottom: none;
    border-top-left-radius: ${(props) => props.theme.borderRadius.sm};
    border-top-right-radius: ${(props) => props.theme.borderRadius.sm};
    box-shadow: 0 5px 5px -3px ${(props) => props.theme.color.greyLight};
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
    border-bottom-left-radius: ${(props) => props.theme.borderRadius.sm};
    border-bottom-right-radius: ${(props) => props.theme.borderRadius.sm};
    z-index: 10;
`;

type StyledAnalysisViewerListProps = {
    width: number;
};

const StyledAnalysisViewerList = styled.div<StyledAnalysisViewerListProps>`
    position: relative;
    width: ${(props) => props.width}px;
`;

type AnalysisViewerListProps = {
    children: React.ReactNode;
    itemSize: number;
    /** A list of filtered and sorted hits */
    matches?: FormattedNuvsHit[];
    /** The total number of hits */
    total?: number;
    width: number;
};

/**
 * Displays a list of hits for an analysis
 */
export default function AnalysisViewerList({
    children,
    itemSize,
    matches,
    total,
    width,
}: AnalysisViewerListProps) {
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");
    const activeId = Number(activeHit);
    const active = useGetActiveHit(matches);

    const shown = matches.length;

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

    const ref = useKeyNavigation(
        activeId,
        nextId,
        nextIndex,
        previousId,
        previousIndex,
        true,
        (id) => setActiveHit(id),
    );

    return (
        <StyledAnalysisViewerList width={width}>
            <AnalysisViewerListHeader>
                Showing {shown} of {total}
            </AnalysisViewerListHeader>
            <AnalysisViewerListWindow
                ref={ref}
                height={500}
                width={width}
                itemCount={shown}
                itemSize={itemSize}
            >
                {({ index, style }) => (
                    <div style={style}>{children[index]}</div>
                )}
            </AnalysisViewerListWindow>
            <AnalysisViewerListFooter>
                Use <Key>w</Key> and <Key>s</Key> to move
            </AnalysisViewerListFooter>
        </StyledAnalysisViewerList>
    );
}
