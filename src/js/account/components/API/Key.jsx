import { isEqual, reduce } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Attribution, BoxSpaced, Button, ButtonToolbar, Icon } from "../../../base/index";
import { removeAPIKey, updateAPIKey } from "../../actions";
import APIPermissions from "./APIPermissions";

export const getInitialState = ({ apiKey }) => ({
    in: false,
    changed: false,
    permissions: apiKey.permissions,
});

const APIKeyCloseContainer = styled.div`
    text-align: right;
`;

const APIKeyHeader = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr 1fr 1fr;
`;

const APIKeyPermissionCount = styled.div`
    text-align: right;
`;

const APIKeyPermissions = styled(APIPermissions)`
    margin-top: 15px;
`;

export class APIKey extends React.Component {
    constructor(props) {
        super(props);
        this.state = getInitialState(props);
    }

    toggleIn = () => {
        const state = {
            in: !this.state.in,
        };

        if (this.state.in) {
            state.permissions = this.props.apiKey.permissions;
        }

        this.setState(state);
    };

    onPermissionChange = (key, value) => {
        const permissions = { ...this.state.permissions, [key]: value };

        this.setState({
            changed: !isEqual(permissions, this.props.apiKey.permissions),
            permissions,
        });
    };

    render() {
        const permissionCount = reduce(this.props.apiKey.permissions, (result, value) => result + (value ? 1 : 0), 0);

        return (
            <BoxSpaced key={this.props.apiKey.id} onClick={this.state.in ? null : this.toggleIn}>
                <APIKeyHeader>
                    <strong>{this.props.apiKey.name}</strong>
                    <Attribution time={this.props.apiKey.created_at} />
                    <APIKeyPermissionCount>
                        {permissionCount} permission{permissionCount === 1 ? null : "s"}
                    </APIKeyPermissionCount>
                    <APIKeyCloseContainer>
                        {this.state.in && <Icon name="times" aria-label="close" onClick={this.toggleIn} />}
                    </APIKeyCloseContainer>
                </APIKeyHeader>
                {this.state.in && (
                    <div>
                        <APIKeyPermissions
                            userPermissions={this.props.permissions}
                            keyPermissions={this.state.permissions}
                            onChange={this.onPermissionChange}
                        />

                        <ButtonToolbar>
                            <Button color="red" icon="trash" onClick={() => this.props.onRemove(this.props.apiKey.id)}>
                                Remove
                            </Button>
                            <Button
                                color="blue"
                                icon="save"
                                onClick={() => this.props.onUpdate(this.props.apiKey.id, this.state.permissions)}
                                disabled={!this.state.changed}
                            >
                                Update
                            </Button>
                        </ButtonToolbar>
                    </div>
                )}
            </BoxSpaced>
        );
    }
}

export const mapStateToProps = state => ({
    permissions: state.account.permissions,
});

export const mapDispatchToProps = dispatch => ({
    onUpdate: (keyId, permissions) => {
        dispatch(updateAPIKey(keyId, permissions));
    },

    onRemove: keyId => {
        dispatch(removeAPIKey(keyId));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(APIKey);
