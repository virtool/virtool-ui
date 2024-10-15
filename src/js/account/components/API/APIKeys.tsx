import { useFetchAPIKeys } from "@account/queries";
import { getFontSize, getFontWeight } from "@app/theme";
import { Box, BoxGroup, ExternalLink, LoadingPlaceholder, NoneFoundBox, Link } from "@base";
import { formatSearchParams } from "@utils/hooks";
import { map } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { useSearch } from "wouter";
import APIKey from "./APIKey";
import CreateAPIKey from "./CreateAPIKey";

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
 * A component to manage and display API keys
 */
export default function APIKeys() {
    const { data, isPending } = useFetchAPIKeys();
    const search = useSearch();

    if (isPending) {
        return <LoadingPlaceholder className="mt-36" />;
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
                <Link to={`/account/api/${formatSearchParams("openCreateKey", "true", search)}`} replace>
                    Create
                </Link>
            </APIKeysHeader>

            {keyComponents.length ? <BoxGroup>{keyComponents}</BoxGroup> : <NoneFoundBox noun="API keys" />}

            <CreateAPIKey />
        </div>
    );
}
