import { sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { LoadingPlaceholder, SectionHeader } from "../../../base";
import { useGetReference } from "../../hooks";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./ReferenceMembers";
import RemoveReference from "./Remove";

export function ReferenceSettings({ isRemote, match }) {
    const { refId } = match.params;
    const { data, isLoading } = useGetReference(refId);

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            {isRemote || <LocalSourceTypes />}
            <SectionHeader>
                <h2>Access</h2>
                <p>Manage who can access this reference.</p>
            </SectionHeader>
            <ReferenceMembers noun="user" members={sortBy(data.users, "id")} refId={refId} />
            <ReferenceMembers noun="group" members={sortBy(data.groups, "id")} refId={refId} />
            <SectionHeader>
                <h2>Delete</h2>
                <p>Permanently delete the reference.</p>
            </SectionHeader>
            <RemoveReference />
        </>
    );
}

export function mapStateToProps(state) {
    return {
        isRemote: Boolean(state.references.detail.remotes_from),
    };
}

export default connect(mapStateToProps)(ReferenceSettings);
