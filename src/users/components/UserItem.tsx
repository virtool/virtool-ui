import { useCheckAdminRole } from "@administration/hooks";
import { AdministratorRoleName } from "@administration/types";
import { getFontSize, getFontWeight } from "@app/theme";
import BoxGroupSection from "@base/BoxGroupSection";
import Icon from "@base/Icon";
import InitialIcon from "@base/InitialIcon";
import Label from "@base/Label";
import Link from "@base/Link";
import { GroupMinimal } from "@groups/types";
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
    administrator_role: AdministratorRoleName;
    handle: string;
    id: string;
    /** The primary group assigned to the user */
    primary_group: GroupMinimal;
};

/**
 * A condensed user item for use in a list of users
 */
export function UserItem({
    active,
    administrator_role,
    handle,
    id,
    primary_group,
}: UserItemProps): JSX.Element {
    const { hasPermission: canEdit } = useCheckAdminRole(
        administrator_role === null
            ? AdministratorRoleName.USERS
            : AdministratorRoleName.FULL,
    );

    return (
        <StyledUserItem>
            <UserContainer>
                <InitialIcon size="lg" handle={handle} />
                {canEdit ? (
                    <UserLink to={`/administration/users/${id}`}>
                        {handle}
                    </UserLink>
                ) : (
                    <strong>{handle}</strong>
                )}
            </UserContainer>
            <TagContainer>
                {administrator_role && (
                    <Label color="purple">
                        <Icon name="user-shield" /> {administrator_role}{" "}
                        Administrator
                    </Label>
                )}
            </TagContainer>
            <TagContainer>
                {primary_group && <Label>{primary_group.name}</Label>}
            </TagContainer>
            <TagContainer>
                {!active && <Label color="red">Deactivated</Label>}
            </TagContainer>
        </StyledUserItem>
    );
}
