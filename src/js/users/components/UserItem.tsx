import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useCheckAdminRole } from "../../administration/hooks";
import { AdministratorRoles } from "../../administration/types";
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

function AdminTag({ administrator_role }) {
    return (
        <AdminTagContainer>
            <Label color="purple">
                <Icon name="user-shield" /> {administrator_role} Administrator
            </Label>
        </AdminTagContainer>
    );
}

function EditButton({ id }) {
    return (
        <StyledButtonSmall color="grey" as={Link} to={`users/${id}`}>
            <Icon name="pen" /> <span>Edit</span>
        </StyledButtonSmall>
    );
}

/**
 * A single user element for use in a list
 *
 * @param id - The user's id
 * @param handle - The user's handle
 * @param administrator_role - The user's administrator role
 * @returns A single user element
 */

export function UserItem({ id, handle, administrator_role }) {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administrator_role === null ? AdministratorRoles.USERS : AdministratorRoles.FULL,
    );

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
}
