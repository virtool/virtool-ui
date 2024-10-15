import { LoadingPlaceholder, SectionHeader } from "@base";
import { sortBy } from "lodash-es";
import React from "react";
import { useGetReference } from "../../queries";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";
import RemoveReference from "./RemoveReference";
import { useSearchParams } from "@utils/hooks";

/**
 * The reference settings view allowing users to manage the reference
 */
export default function ReferenceSettings() {
    const { refId } = useSearchParams<{ refId: string }>();
    const { data, isPending } = useGetReference(refId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            {Boolean(data.remotes_from) || <LocalSourceTypes />}
            <SectionHeader>
                <h2>Access</h2>
                <p>Manage who can access this reference.</p>
            </SectionHeader>
            <ReferenceMembers noun="user" members={sortBy(data.users, "id")} refId={refId} />
            <ReferenceMembers noun="group" members={sortBy(data.groups, "id")} refId={refId} />
            <RemoveReference id={data.id} name={data.name} />
        </>
    );
}
