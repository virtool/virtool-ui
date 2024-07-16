import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoles } from "@administration/types";
import { getFontSize, getFontWeight } from "@app/theme";
import { BoxGroupSection, Icon, InitialIcon, Label } from "@base";
import { StyledButtonSmall } from "@base/styled/StyledButtonSmall";
import { GroupMinimal } from "@groups/types";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledUserItem = styled(BoxGroupSection)`
    display: grid;
    grid-template-columns: 50% 25% 1fr auto;
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

const UserLink = styled(Link)`
    padding: 0 10px;
    font-size: ${getFontSize("lg")};
    font-weight: ${getFontWeight("thick")};
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 5;
    flex-basis: 0;
`;

const TagContainer = styled(UserContainer)`
    flex-grow: 1.5;
    justify-content: flex-start;
    font-size: ${getFontSize("md")};
    text-transform: capitalize;
`;

type UserItemProps = {
    /** Whether the user is active */
    active: boolean;
    administratorRole: AdministratorRoles;
    handle: string;
    id: string;
    /** The primary group assigned to the user */
    primary_group: GroupMinimal;
};

/**
 * A condensed user item for use in a list of users
 */
export function UserItem({ active, administratorRole, handle, id, primary_group }: UserItemProps): JSX.Element {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administratorRole === null ? AdministratorRoles.USERS : AdministratorRoles.FULL,
    );

    return (
        <StyledUserItem>
            <UserContainer>
                <InitialIcon size="lg" handle={handle} />
                {canEdit ? <UserLink to={`users/${id}`}>{handle}</UserLink> : <strong>{handle}</strong>}
            </UserContainer>
            <TagContainer>
                {administratorRole && (
                    <Label color="purple">
                        <Icon name="user-shield" /> {administratorRole} Administrator
                    </Label>
                )}
            </TagContainer>
            <TagContainer>{primary_group && <Label>{primary_group.name}</Label>}</TagContainer>
            <TagContainer>{!active && <Label color="redLight">Deactivated</Label>}</TagContainer>
        </StyledUserItem>
    );
}
