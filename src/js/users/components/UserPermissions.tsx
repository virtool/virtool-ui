import { transform } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getFontSize } from "../../app/theme";
import { BoxGroup } from "../../base";
import { Permissions } from "../../groups/types";
import { PermissionItem } from "./Permission";

const UserPermissionsHeader = styled.div`
    align-items: center;
    display: flex;

    small {
        color: ${props => props.theme.color.greyDarkest};
        font-size: ${getFontSize("sm")};
        margin-left: auto;
    }
`;

type UserPermissionsProps = {
    /** The users permissions */
    permissions: Permissions;
};

/**
 * A view of the users permissions
 */
export default function UserPermissions({ permissions }: UserPermissionsProps) {
    return (
        <div>
            <UserPermissionsHeader>
                <label>Permissions</label>
                <small>Change group membership to modify permissions</small>
            </UserPermissionsHeader>
            <BoxGroup>
                {transform(
                    permissions,
                    (acc, value, permission) =>
                        acc.push(<PermissionItem key={permission} permission={permission} value={value} />),
                    []
                )}
            </BoxGroup>
        </div>
    );
}
