import { useFetchAPIKeys } from "@account/queries";
import { getFontSize, getFontWeight } from "@app/theme";
import { Box, ExternalLink, LoadingPlaceholder, NoneFoundBox } from "@base";
import { map } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CreateAPIKey from "./CreateAPIKey";
import APIKey from "./Key";

const APIKeysHeader = styled(Box)`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
    margin-bottom: 15px;

    > a:last-child {
        margin-left: auto;
    }
`;

/**
 * A component to manage and display API keys for the logged-in user
 */
export default function APIKeys() {
    const { data, isLoading } = useFetchAPIKeys();

    if (isLoading) {
        return <LoadingPlaceholder margin="150px" />;
    }

    const keyComponents = data.length && map(data, key => <APIKey key={key.id} apiKey={key} />);

    return (
        <div>
            <APIKeysHeader>
                <div>
                    <span>Manage API keys for accessing the </span>
                    <ExternalLink href="https://www.virtool.ca/docs/developer/api_account/">Virtool API</ExternalLink>
                    <span>.</span>
                </div>
                <Link to={{ state: { createAPIKey: true } }}>Create</Link>
            </APIKeysHeader>

            {keyComponents.length ? keyComponents : <NoneFoundBox noun="API keys" />}

            <CreateAPIKey />
        </div>
    );
}
