import { map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Box, ExternalLink, LoadingPlaceholder, NoneFoundBox } from "../../../base/index";

import { getAPIKeys } from "../../actions";
import CreateAPIKey from "./Create";
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

export function APIKeys({ keys, onGet }) {
    useEffect(onGet, []);

    if (keys === null) {
        return <LoadingPlaceholder margin="150px" />;
    }

    const keyComponents = map(keys, key => <APIKey key={key.id} apiKey={key} />);

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

const mapStateToProps = state => ({
    keys: state.account.apiKeys,
});

const mapDispatchToProps = dispatch => ({
    onGet: () => {
        dispatch(getAPIKeys());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(APIKeys);
