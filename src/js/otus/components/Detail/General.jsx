import React from "react";
import { connect } from "react-redux";
import OTUIssues from "./OTUIssues";

export const OTUGeneral = ({ issues, isolates }) => {
    if (issues) {
        return <OTUIssues issues={issues} isolates={isolates} />;
    }

    return null;
};

export const mapStateToProps = state => {
    const { issues, isolates } = state.otus.detail;
    return {
        issues,
        isolates,
    };
};

export default connect(mapStateToProps)(OTUGeneral);
