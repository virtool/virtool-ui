import { sortBy } from "lodash-es";
import React, { useState } from "react";
import { match } from "react-router-dom";
import { LoadingPlaceholder, SectionHeader } from "../../../base";
import { useInfiniteFindGroups } from "../../../groups/querys";
import { useInfiniteFindUsers } from "../../../users/querys";
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
    const [term, setTerm] = useState("");
    const { data: reference, isLoading: isLoadingReference } = useGetReference(refId);
    const {
        data: users,
        isLoading: isLoadingUsers,
        isFetchingNextPage: isFetchingUsersNextPage,
        fetchNextPage: fetchUsersNextPage,
    } = useInfiniteFindUsers(25, term);
    const {
        data: groups,
        isLoading: isLoadingGroups,
        isFetchingNextPage: isFetchingGroupsNextPage,
        fetchNextPage: fetchGroupsNextPage,
    } = useInfiniteFindGroups(25, term);

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
                isFetchingNextPage={isFetchingUsersNextPage}
                fetchNextPage={fetchUsersNextPage}
                isLoading={isLoadingUsers}
            />
            <ReferenceMembers
                data={groups}
                noun="group"
                members={sortBy(reference.groups, "id")}
                refId={refId}
                term={term}
                setTerm={setTerm}
                isFetchingNextPage={isFetchingGroupsNextPage}
                fetchNextPage={fetchGroupsNextPage}
                isLoading={isLoadingGroups}
            />
            <SectionHeader>
                <h2>Delete</h2>
                <p>Permanently delete the reference.</p>
            </SectionHeader>
            <RemoveReference />
        </>
    );
}
