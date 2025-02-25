import { IconButton } from "@base/IconButton";
import React from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { BoxSpaced, InitialIcon } from "../../../base";
import { User } from "../../../users/types";
import { useSetAdministratorRole } from "../../queries";
import { AdministratorRoles } from "../../types";
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
