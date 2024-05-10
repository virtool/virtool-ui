import React from "react";
import styled from "styled-components";
import { BoxGroupSection, Icon } from "../../base";

const StyledPermissionIcon = styled(Icon)`
    margin-right: 15px;
`;

const StyledPermissionItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;

/**
A condensed permission item for use in a list of user permissions
 * @prop permission - name of the permission.
 * @prop value - indicates if the permission is granted.
 */
export function PermissionItem({ permission, value }: { permission: string; value: boolean }) {
    return (
        <StyledPermissionItem aria-label={`${permission}:${value}`}>
            <StyledPermissionIcon name={value ? "check" : "times"} color={value ? "green" : "red"} fixedWidth />
            <code>{permission}</code>
        </StyledPermissionItem>
    );
}
