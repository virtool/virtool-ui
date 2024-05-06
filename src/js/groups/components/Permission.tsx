import React from "react";
import styled from "styled-components";
import { Checkbox, SelectBoxGroupSection } from "../../base";

const StyledGroupPermission = styled(SelectBoxGroupSection)`
    background-color: ${props => (props.active ? props.theme.color.blue : "white")};
    user-select: none;
`;

type GroupPermissionProps = {
    /** Whether the permission is currently active */
    active: boolean;
    /** The name of the permission */
    permission: string;
    /** Handles click event when permission is clicked */
    onClick: () => void;
};

/**
 * Group permission checkbox
 */
export function GroupPermission({ active, permission, onClick }: GroupPermissionProps) {
    console.log(permission);
    return (
        <StyledGroupPermission active={active} onClick={onClick}>
            <Checkbox checked={active} label={permission} />
        </StyledGroupPermission>
    );
}
