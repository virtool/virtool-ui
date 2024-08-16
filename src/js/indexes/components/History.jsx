import { BoxGroup, BoxGroupHeader, BoxGroupSection, LoadingPlaceholder } from "@base";
import { cn } from "@utils/utils.js";
import { map, sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";

const RebuildHistoryContent = styled.div`
    max-height: 700px;
    overflow-y: auto;
`;

export const RebuildHistoryEllipsis = ({ unbuilt }) => {
    if (unbuilt.page_count > 1) {
        return (
            <BoxGroupSection className={cn("text-right")} key="last-item">
                + {unbuilt.total_count - unbuilt.per_page} more changes
            </BoxGroupSection>
        );
    }

    return null;
};

export const RebuildHistoryItem = ({ description, otuName }) => (
    <BoxGroupSection className={cn("grid", "grid-cols-2")}>
        <strong>{otuName}</strong>

        {description || "No Description"}
    </BoxGroupSection>
);

export default function RebuildHistory({ unbuilt }) {
    let content;

    if (unbuilt === null) {
        content = <LoadingPlaceholder className="mt-5" />;
    } else {
        const historyComponents = map(sortBy(unbuilt.documents, "otu.name"), change => (
            <RebuildHistoryItem key={change.id} description={change.description} otuName={change.otu.name} />
        ));

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
