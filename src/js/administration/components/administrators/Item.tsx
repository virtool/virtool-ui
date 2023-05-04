import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { BoxSpaced, Icon, InitialIcon } from "../../../base";
import { User } from "../../../users/types";
import { useSetAdministratorRole } from "../../querys";
import { AdministratorRole, AdministratorRoles } from "../../types";
import { RoleSelect } from "./RoleSelect";

const StyledAdministrator = styled(BoxSpaced)`
    display: flex;
    align-items: center;

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
    roles: Array<AdministratorRole>;
};

export const AdministratorItem = ({ user, roles }: AdministratorItemProps) => {
    const editMutation = useSetAdministratorRole();
    const onChange = (value: AdministratorRoles) => {
        editMutation.mutate({ user_id: user.id, role: value });
    };

    return (
        <StyledAdministrator key={user.id}>
            <InitialIcon handle={user.handle} size={"lg"} />
            <UserHandle>{user.handle}</UserHandle>
            <InlineRoleSelect value={user.administrator_role} roles={roles} onChange={onChange} />
            <Icon name="trash" color="red" onClick={() => onChange(null)} aria-label={`remove role`} />
        </StyledAdministrator>
    );
};
