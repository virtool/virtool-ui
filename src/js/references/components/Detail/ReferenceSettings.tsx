import { sortBy } from "lodash-es";
import React, { useState } from "react";
import { match } from "react-router-dom";
import { LoadingPlaceholder, SectionHeader } from "../../../base";
import { useListGroups } from "../../../groups/querys";
import { useInfiniteFindUsers } from "../../../users/querys";
import { useGetReference } from "../../hooks";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";
import RemoveReference from "./Remove";

type ReferenceSettingsProps = {
    /** Match object containing path information */
    match: match<{ refId: string }>;
};

export default function ReferenceSettings({ match }: ReferenceSettingsProps) {
    const { refId } = match.params;
    const [term, setTerm] = useState("");
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);
    const {
        data: users,
        isLoading: isLoadingUsers,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteFindUsers(25, term);
    const { data: groups, isLoading: isLoadingGroups } = useListGroups();

    if (isLoadingReference || isLoadingUsers || isLoadingGroups) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            {Boolean(reference.remotes_from) || <LocalSourceTypes />}
            <SectionHeader>
                <h2>Access</h2>
                <p>Manage who can access this reference.</p>
            </SectionHeader>
            <ReferenceMembers
                data={users}
                noun="user"
                members={sortBy(reference.users, "id")}
                refId={refId}
                term={term}
                setTerm={setTerm}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
                isLoading={isLoadingUsers}
            />
            <ReferenceMembers data={groups} noun="group" members={sortBy(reference.groups, "id")} refId={refId} />
            <SectionHeader>
                <h2>Delete</h2>
                <p>Permanently delete the reference.</p>
            </SectionHeader>
            <RemoveReference />
        </>
    );
}
