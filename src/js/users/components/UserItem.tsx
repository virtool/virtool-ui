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

type AdministratorTagProps = {
    administratorRole: AdministratorRoles;
};

/**
 * An inline tag indicating a user's administrator role
 *
 * @param administratorRole - The user's administrator role
 * @returns An inline tag indicating a user's administrator role
 */
function AdministratorTag({ administratorRole }: AdministratorTagProps) {
    return (
        <AdminTagContainer>
            <Label color="purple">
                <Icon name="user-shield" /> {administratorRole} Administrator
            </Label>
        </AdminTagContainer>
    );
}

/**
 * An inline button linking to a user's detailed view
 *
 * @param id - The user's id
 * @returns An button linking to a user's detailed view
 */
function EditButton({ id }: { id: string }): JSX.Element {
    return (
        <StyledButtonSmall color="grey" as={Link} to={`users/${id}`}>
            <Icon name="pen" /> <span>Edit</span>
        </StyledButtonSmall>
    );
}

type UserItemProps = {
    id: string;
    handle: string;
    administratorRole: AdministratorRoles;
};

/**
 * A single user element for use in a list
 *
 * @param id - The user's id
 * @param handle - The user's handle
 * @param administratorRole - The user's administrator role
 * @returns A single user element
 */
export function UserItem({ id, handle, administratorRole }: UserItemProps): JSX.Element {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administratorRole === null ? AdministratorRoles.USERS : AdministratorRoles.FULL,
    );

    const edit = canEdit ? (
        <EditButton id={id} />
    ) : (
        <InsufficentRightsContainer>Insufficient rights</InsufficentRightsContainer>
    );

    return (
        <StyledUserItem>
            <UserContainer>
                <InitialIcon size="lg" handle={handle} />
                <strong>{handle}</strong>
            </UserContainer>
            {administratorRole && <AdministratorTag administratorRole={administratorRole} />}
            {edit}
        </StyledUserItem>
    );
}
