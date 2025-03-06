import { BoxGroupHeader, BoxGroupSection, LoadingPlaceholder } from "@/base";
import BoxGroup from "@base/BoxGroup";
import { map, sortBy } from "lodash-es";
import React, { ReactNode } from "react";
import styled from "styled-components";

const StyledRebuildHistoryItem = styled(BoxGroupSection)`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const RebuildHistoryContent = styled.div`
    max-height: 700px;
    overflow-y: auto;
`;

const StyledRebuildHistoryEllipsis = styled(BoxGroupSection)`
    text-align: right;
`;

function RebuildHistoryEllipsis({ unbuilt }) {
    if (unbuilt.page_count > 1) {
        return (
            <StyledRebuildHistoryEllipsis key="last-item">
                + {unbuilt.total_count - unbuilt.per_page} more changes
            </StyledRebuildHistoryEllipsis>
        );
    }
}

function RebuildHistoryItem({ description, otuName }) {
    return (
        <StyledRebuildHistoryItem>
            <strong>{otuName}</strong>

            {description || "No Description"}
        </StyledRebuildHistoryItem>
    );
}

export default function RebuildHistory({ unbuilt }) {
    let content: ReactNode;

    if (unbuilt === null) {
        content = <LoadingPlaceholder className="mt-5" />;
    } else {
        const historyComponents = map(
            sortBy(unbuilt.documents, "otu.name"),
            (change) => (
                <RebuildHistoryItem
                    key={change.id}
                    description={change.description}
                    otuName={change.otu.name}
                />
            ),
        );

        content = (
            <RebuildHistoryContent>
                {historyComponents}
                <RebuildHistoryEllipsis unbuilt={unbuilt} />
            </RebuildHistoryContent>
        );
    }

    return (
        <BoxGroup>
            <BoxGroupHeader>Changes</BoxGroupHeader>
            {content}
        </BoxGroup>
    );
}
