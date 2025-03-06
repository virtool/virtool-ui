import { BoxGroupHeader } from "@/base";
import BoxGroup from "@base/BoxGroup";
import { BoxGroupHeaderBadge } from "@base/BoxGroupHeaderBadge";
import Change from "@otus/components/Detail/History/Change";
import { OTUHistory } from "@otus/types";
import { map, reverse, sortBy } from "lodash-es";
import React from "react";

type HistoryListProps = {
    /** The history of built or unbuilt changes */
    history: OTUHistory[];
    /** Whether the changes are unbuilt */
    unbuilt?: boolean;
};

/**
 * Displays a history list of changes with options to revert the OTU
 */
export default function HistoryList({ history, unbuilt }: HistoryListProps) {
    const changes = reverse(sortBy(history, "otu.version"));

    const changeComponents = map(changes, (change, index) => (
        <Change
            key={index}
            id={change.id}
            methodName={change.method_name}
            otu={change.otu}
            user={change.user}
            description={change.description}
            createdAt={change.created_at}
            unbuilt={unbuilt}
        />
    ));

    return (
        <BoxGroup>
            <BoxGroupHeader>
                <h2>
                    <span>{unbuilt ? "Unb" : "B"}uilt Changes</span>
                    <BoxGroupHeaderBadge>{changes.length}</BoxGroupHeaderBadge>
                </h2>
            </BoxGroupHeader>
            {changeComponents}
        </BoxGroup>
    );
}
