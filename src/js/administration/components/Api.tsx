import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { ExternalLink, LoadingPlaceholder } from "../../base";
import { updateSettings } from "../api";
import { settingsQueryKeys, useFetchSettings } from "../querys";
import { SettingsCheckbox } from "./SettingsCheckbox";

/**
 * Displays the API settings and allows the users to toggle API access for clients
 */
export default function Api() {
    const { data, isLoading } = useFetchSettings();
    const queryClient = useQueryClient();
    const mutation = useMutation(updateSettings, {
        onSuccess: () => {
            queryClient.invalidateQueries(settingsQueryKeys.all());
        },
    });

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    function onToggle() {
        mutation.mutate({ enable_api: !data.enable_api });
    }

    return (
        <SettingsCheckbox enabled={data.enable_api} onToggle={onToggle}>
            <h2>JSON API</h2>
            <small>Enable API access for clients other than Virtool. See </small>
            <ExternalLink href="https://www.virtool.ca/docs/developer/api_account">API documentation</ExternalLink>.
        </SettingsCheckbox>
    );
}