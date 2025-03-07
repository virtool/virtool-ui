import { getFontSize, getFontWeight } from "@app/theme";
import InitialIcon from '@base/InitialIcon';
import IconButton from "@base/IconButton";
import { User } from "@users/types";
import React from "react";
import styled from "styled-components";
import { useSetAdministratorRole } from "../../queries";
import { AdministratorRoles } from "../../types";
import { RoleSelect } from "./RoleSelect";

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

const InlineRoleSelect = styled(RoleSelect)`
    width: 200px;
`;

type AdministratorItemProps = {
    user: User;
    roles: Array<AdministratorRoles>;
};

export const AdministratorItem = ({ user, roles }: AdministratorItemProps) => {
    const editMutation = useSetAdministratorRole();
    const onChange = (value: AdministratorRoles) => {
        editMutation.mutate({ user_id: user.id, role: value });
    };

    return (
        <StyledAdministrator key={user.id}>
            <InitialIcon handle={user.handle} size="lg" />
            <UserHandle>{user.handle}</UserHandle>
            <InlineRoleSelect
                value={user.administrator_role}
                roles={roles}
                onChange={onChange}
            />
            <IconButton
                name="trash"
                color="red"
                tip="remove administrator role"
                onClick={() => onChange(null)}
            />
        </StyledAdministrator>
    );
};
