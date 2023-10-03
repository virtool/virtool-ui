import React from "react";
import styled from "styled-components";
import { Checkbox, SelectBoxGroupSection } from "../../base";

const StyledGroupPermission = styled(SelectBoxGroupSection)`
    background-color: ${props => (props.active ? props.theme.color.blue : "white")};
    user-select: none;
`;

type GroupPermissionTypes = {
    active: boolean;
    permission: string;
    onClick: () => void;
};

/**
 * Group Permission checkbox
 *
 * @param active - Indicates whether the permission is currently active.
 * @param permission - The name of permissions
 * @param onClick - Handles click event when permission is clicked
 * @returns A list of permissions for a group
 */
export function GroupPermission({ active, permission, onClick }: GroupPermissionTypes) {
    return (
        <StyledGroupPermission active={active} onClick={onClick}>
            <Checkbox checked={active} label={permission} />
        </StyledGroupPermission>
    );
}
