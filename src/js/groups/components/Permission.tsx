import React from "react";
import styled from "styled-components";
import { Checkbox, SelectBoxGroupSection } from "../../base";

const StyledGroupPermission = styled(SelectBoxGroupSection)`
    background-color: ${props => (props.active ? props.theme.color.blue : "white")};
    user-select: none;
`;

type GroupPermissionProps = {
    active: boolean;
    permission: string;
    onClick: () => void;
};

/**
 * Group permission checkbox
 *
 * @param active - Whether the permission is currently active
 * @param permission - The name of the permission
 * @param onClick - Handles click event when permission is clicked
 * @returns A list of permissions corresponding to a group
 */
export function GroupPermission({ active, permission, onClick }: GroupPermissionProps) {
    return (
        <StyledGroupPermission active={active} onClick={onClick}>
            <Checkbox checked={active} label={permission} />
        </StyledGroupPermission>
    );
}
