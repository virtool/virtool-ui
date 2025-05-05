import React from "react";
import ExternalLink from "../../base/ExternalLink";
import { useUpdateSettings } from "../queries";
import { Settings } from "../types";
import { SettingsCheckbox } from "./SettingsCheckbox";

type ApiProps = {
    /** The settings data used for configuring the external API access */
    settings: Settings;
};

/**
 * A component managing JSON API settings, allowing users to toggle external API access
 */
export default function Api({ settings: { enable_api } }: ApiProps) {
    const mutation = useUpdateSettings();

    return (
        <SettingsCheckbox
            enabled={enable_api}
            id="EnableApi"
            onToggle={() => mutation.mutate({ enable_api: !enable_api })}
        >
            <h2>JSON API</h2>
            <small>
                Enable API access for clients other than Virtool. See{" "}
            </small>
            <ExternalLink href="https://www.virtool.ca/docs/api/overview/authentication/">
                API documentation
            </ExternalLink>
            .
        </SettingsCheckbox>
    );
}
