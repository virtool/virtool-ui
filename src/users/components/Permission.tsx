import React from "react";
import styled from "styled-components";
import BoxGroupSection from "../../base/BoxGroupSection";
import Icon from "../../base/Icon";

const StyledPermissionIcon = styled(Icon)`
    margin-right: 15px;
`;

const StyledPermissionItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
`;

type PermissionItemProps = {
    /* Name of the permission */
    permission: string;
    /* Indicates if the permission is granted */
    value: boolean;
};

/**
 * A condensed permission item for use in a list of user permissions
 */
export function PermissionItem({ permission, value }: PermissionItemProps) {
    return (
        <StyledPermissionItem aria-label={`${permission}:${value}`}>
            <StyledPermissionIcon
                name={value ? "check" : "times"}
                color={value ? "green" : "red"}
                fixedWidth
            />
            <code>{permission}</code>
        </StyledPermissionItem>
    );
}
