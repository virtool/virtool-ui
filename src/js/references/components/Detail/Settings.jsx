import React from "react";
import { connect } from "react-redux";
import { SectionHeader } from "../../../base";
import { LocalSourceTypes } from "../SourceTypes/LocalSourceTypes";
import ReferenceMembers from "./Members";
import RemoveReference from "./Remove";

export function ReferenceSettings({ isRemote }) {
    return (
        <>
            {isRemote || <LocalSourceTypes />}
            <SectionHeader>
                <h2>Access</h2>
                <p>Manage who can access this reference.</p>
            </SectionHeader>
            <ReferenceMembers noun="user" />
            <ReferenceMembers noun="group" />
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
