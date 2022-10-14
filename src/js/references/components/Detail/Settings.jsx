import React from "react";
import { connect } from "react-redux";
import SourceTypes from "../SourceTypes/SourceTypes";
import ReferenceMembers from "./Members";
import RemoveReference from "./Remove";

export const ReferenceSettings = ({ isRemote }) => (
    <>
        {isRemote ? null : <SourceTypes />}
        <ReferenceMembers noun="user" />
        <ReferenceMembers noun="group" />
        <RemoveReference />
    </>
);

export const mapStateToProps = state => ({
    isRemote: Boolean(state.references.detail.remotes_from)
});

export default connect(mapStateToProps)(ReferenceSettings);
