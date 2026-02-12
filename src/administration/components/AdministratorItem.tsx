import { useSetAdministratorRole } from "@administration/queries";
import {
    AdministratorRole,
    AdministratorRoleName,
} from "@administration/types";
import { getFontSize, getFontWeight } from "@app/theme";
import IconButton from "@base/IconButton";
import InitialIcon from "@base/InitialIcon";
import { User } from "@users/types";
import { Trash } from "lucide-react";
import styled from "styled-components";
import AdministratorRoleSelect from "./AdministratorRoleSelect";

const StyledAdministrator = styled.div`
    align-items: center;
    box-shadow: ${(props) => props.theme.boxShadow.md};
    display: flex;
    margin-bottom: 10px;

    svg {
        margin-right: 10px;
    }

    button {
        margin-left: auto;
    }

    button:last-child {
        margin-left: 10px;
    }
`;

const UserHandle = styled.span`
    font-weight: ${getFontWeight("thick")};
    font-size: ${getFontSize("lg")};
`;

type AdministratorItemProps = {
    roles: AdministratorRole[];
    user: User;
};

export default function AdministratorItem({
    user,
    roles,
}: AdministratorItemProps) {
    const editMutation = useSetAdministratorRole();

    function onChange(value: AdministratorRoleName) {
        editMutation.mutate({ user_id: user.id, role: value });
    }

    return (
        <StyledAdministrator key={user.id}>
            <InitialIcon handle={user.handle} size="lg" />
            <UserHandle>{user.handle}</UserHandle>
            <AdministratorRoleSelect
                id={`role-${user.id}`}
                onChange={onChange}
                roles={roles}
                value={user.administrator_role}
            />
            <IconButton
                IconComponent={Trash}
                color="red"
                tip="remove administrator role"
                onClick={() => onChange(null)}
            />
        </StyledAdministrator>
    );
}
