import React from "react";
import { connect } from "react-redux";
import { updateSetting } from "../actions";
import { ExternalLink } from "../../base";
import { SettingsCheckbox } from "./SettingsCheckbox";

export const Api = ({ enabled, onToggle }) => (
    <SettingsCheckbox enabled={enabled} onToggle={onToggle}>
        <h2>JSON API</h2>
        <small>Enable API access for clients other than Virtool. See </small>
        <ExternalLink href="https://www.virtool.ca/docs/developer/api_account">API documentation</ExternalLink>.
    </SettingsCheckbox>
);

export const mapStateToProps = state => ({
    enabled: state.settings.data.enable_api
});

export const mapDispatchToProps = dispatch => ({
    onToggle: value => {
        dispatch(updateSetting("enable_api", value));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Api);
