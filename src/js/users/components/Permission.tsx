import { BoxGroupSection, Icon } from "@base";
import { cn } from "@utils/utils";
import React from "react";
import styled from "styled-components";

const StyledPermissionIcon = styled(Icon)`
    margin-right: 15px;
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
        <BoxGroupSection className={cn("items-center", "flex")} aria-label={`${permission}:${value}`}>
            <StyledPermissionIcon name={value ? "check" : "times"} color={value ? "green" : "red"} fixedWidth />
            <code>{permission}</code>
        </BoxGroupSection>
    );
}
