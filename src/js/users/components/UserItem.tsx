import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoles } from "@administration/types";
import { getFontSize, getFontWeight } from "@app/theme";
import { BoxGroupSection, Icon, InitialIcon, Label } from "@base";
import { GroupMinimal } from "@groups/types";
import { cn } from "@utils/utils";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
    administrator_role: AdministratorRoles;
    handle: string;
    id: string;
    /** The primary group assigned to the user */
    primary_group: GroupMinimal;
};

/**
 * A condensed user item for use in a list of users
 */
export function UserItem({ active, administrator_role, handle, id, primary_group }: UserItemProps): JSX.Element {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administrator_role === null ? AdministratorRoles.USERS : AdministratorRoles.FULL
    );

    return (
        <BoxGroupSection className={cn("grid", "grid-cols-[50%_25%_1fr_auto]", "items-center")}>
            <UserContainer>
                <InitialIcon size="lg" handle={handle} />
                {canEdit ? (
                    <UserLink to={`users/${id}`}>{handle}</UserLink>
                ) : (
                    <strong className={cn("text-lg", "font-medium", "pl-2.5")}>{handle}</strong>
                )}
            </UserContainer>
            <TagContainer>
                {administrator_role && (
                    <Label color="purple">
                        <Icon name="user-shield" /> {administrator_role} Administrator
                    </Label>
                )}
            </TagContainer>
            <TagContainer>{primary_group && <Label>{primary_group.name}</Label>}</TagContainer>
            <TagContainer>{!active && <Label color="red">Deactivated</Label>}</TagContainer>
        </BoxGroupSection>
    );
}
