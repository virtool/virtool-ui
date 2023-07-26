import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../app/theme";
import { Alert, device, Icon, InitialIcon, LoadingPlaceholder } from "../../base";
import { listGroups } from "../../groups/actions";
import { getUser } from "../actions";
import UserGroups from "./Groups";
import Password from "./Password";
import UserPermissions from "./Permissions";
import PrimaryGroup from "./PrimaryGroup";

const AdminIcon = styled(Icon)`
    padding-left: 10px;
`;

const UserDetailGroups = styled.div`
    margin-bottom: 15px;

    @media (min-width: ${device.tablet}) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: ${props => props.theme.gap.column};
    }
`;

const UserDetailHeader = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

const UserDetailTitle = styled.div`
    align-items: center;
    display: flex;
    flex: 1 0 auto;
    font-size: ${getFontSize("xl")};
    font-weight: ${getFontWeight("bold")};
    margin-left: 15px;
    .InitialIcon {
        margin-right: 8px;
    }
    a {
        font-size: ${getFontSize("md")};
        margin-left: auto;
    }
`;

export const UserDetail = ({ detail, error, match, onGetUser, onListGroups }) => {
    React.useEffect(() => {
        onGetUser(match.params.userId);
        onListGroups();
    }, []);

    if (error?.length) {
        return (
            <Alert color="orange" level>
                <Icon name="exclamation-circle" />
                <span>
                    <strong>You do not have permission to manage users.</strong>
                    <span> Contact an administrator.</span>
                </span>
            </Alert>
        );
    }

    if (!detail) {
        return <LoadingPlaceholder />;
    }

    const { handle, administrator_role } = detail;

    return (
        <div>
            <UserDetailHeader>
                <UserDetailTitle>
                    <InitialIcon size="xl" handle={handle} />
                    <span>{handle}</span>
                    {administrator_role ? <AdminIcon aria-label="admin" name="user-shield" color="blue" /> : null}
                    <Link to="/administration/users">Back To List</Link>
                </UserDetailTitle>
            </UserDetailHeader>

            <Password key={detail.lastPasswordChange} />

            <UserDetailGroups>
                <div>
                    <UserGroups />
                    <PrimaryGroup />
                </div>
                <UserPermissions />
            </UserDetailGroups>
        </div>
    );
};

export const mapStateToProps = state => ({
    detail: state.users.detail,
    error: get(state, "errors.GET_USER_ERROR.message", ""),
});

export const mapDispatchToProps = dispatch => ({
    onGetUser: userId => {
        dispatch(getUser(userId));
    },

    onListGroups: () => {
        dispatch(listGroups());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
