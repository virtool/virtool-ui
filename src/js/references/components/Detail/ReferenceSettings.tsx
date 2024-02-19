import { sortBy } from "lodash-es";
import React from "react";
import { match } from "react-router-dom";
import { LoadingPlaceholder, SectionHeader } from "../../../base";
import { useGetReference } from "../../hooks";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";
import RemoveReference from "./Remove";

type ReferenceSettingsProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

/**
 * The reference settings view allowing users to manage the reference
 */
export default function ReferenceSettings({ match }: ReferenceSettingsProps) {
    const { refId } = match.params;
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);

    if (isLoadingReference) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            {Boolean(reference.remotes_from) || <LocalSourceTypes />}
            <SectionHeader>
                <h2>Access</h2>
                <p>Manage who can access this reference.</p>
            </SectionHeader>
            <ReferenceMembers noun="user" members={sortBy(reference.users, "id")} refId={refId} />
            <ReferenceMembers noun="group" members={sortBy(reference.groups, "id")} refId={refId} />
            <SectionHeader>
                <h2>Delete</h2>
                <p>Permanently delete the reference.</p>
            </SectionHeader>
            <RemoveReference />
        </>
    );
}
