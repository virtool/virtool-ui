import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AdministratorRoles } from "../../administration/types";
import { hasSufficientAdminRole } from "../../administration/utils";
import { getFontSize, getFontWeight } from "../../app/theme";
import { BoxSpaced, Icon, InitialIcon, Label } from "../../base";
import { StyledButtonSmall } from "../../base/styled/StyledButtonSmall";

const StyledUserItem = styled(BoxSpaced)`
    display: flex;
    align-items: center;

    strong {
        font-size: ${getFontSize("lg")};
        font-weight: ${getFontWeight("thick")};
        padding-left: 10px;
    }

    ${StyledButtonSmall} {
        margin-left: 10px;
    }
`;

const InsufficentRightsContainer = styled.div`
    margin-left: 20px;
    color: ${props => props.theme.color.greyDark};
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    grid-column-start: 1;
    flex-grow: 5;
    flex-basis: 0;
`;

const AdminTagContainer = styled(UserContainer)`
    grid-column-start: 2;
    flex-grow: 1.5;
    justify-content: flex-start;
    font-size: ${getFontSize("md")};
    text-transform: capitalize;
`;

const AdminTag = ({ administrator_role }) => (
    <AdminTagContainer>
        <Label color="purple">
            <Icon name="user-shield" /> {administrator_role} Administrator
        </Label>
    </AdminTagContainer>
);

const EditButton = ({ id }) => (
    <StyledButtonSmall color="grey" as={Link} to={`users/${id}`}>
        <Icon name="pen" /> <span>Edit</span>
    </StyledButtonSmall>
);

export const UserItem = ({ id, handle, administrator_role, canEdit }) => {
    const edit = canEdit ? (
        <EditButton id={id} />
    ) : (
        <InsufficentRightsContainer>Insufficient rights</InsufficentRightsContainer>
    );

    return (
        <StyledUserItem to={`/administration/users/${id}`}>
            <UserContainer>
                <InitialIcon size="lg" handle={handle} />
                <strong>{handle}</strong>
            </UserContainer>
            {administrator_role && <AdminTag administrator_role={administrator_role} />}
            {edit}
        </StyledUserItem>
    );
};

export const mapStateToProps = (state, ownProps) => {
    const { id, handle, administrator_role } = get(state, `users.documents[${ownProps.index}]`, null);
    const canEdit =
        administrator_role === null ||
        hasSufficientAdminRole(AdministratorRoles.FULL, get(state, "account.administrator_role"));
    return {
        id,
        handle,
        administrator_role,
        canEdit
    };
};

export default connect(mapStateToProps)(UserItem);
