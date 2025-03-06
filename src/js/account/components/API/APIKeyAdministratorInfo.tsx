import { useFetchAccount } from "@account/queries";
import { AdministratorRoles } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import { AlertOuter } from "@/base";
import React from "react";
import styled from "styled-components";

const StyledAPIKeyAdministratorInfo = styled(AlertOuter)`
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 15px;
    padding: 15px;

    p:last-of-type {
        margin: 0;
    }
`;

/**
 * Displays a banner with information for an admin user
 */
export default function APIKeyAdministratorInfo() {
    const { data, isPending } = useFetchAccount();

    if (isPending) {
        return null;
    }

    return hasSufficientAdminRole(
        AdministratorRoles.BASE,
        data.administrator_role,
    ) ? (
        <StyledAPIKeyAdministratorInfo color="purple">
            <div>
                <p>
                    <strong>
                        You are an administrator and can create API keys with
                        any permissions granted by that role.
                    </strong>
                </p>
                <p>
                    If your administrator role is reduced or removed, this API
                    key will revert to your new limited set of permissions.
                </p>
            </div>
        </StyledAPIKeyAdministratorInfo>
    ) : null;
}
