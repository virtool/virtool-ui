import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { AdministratorRoles } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import { AlertOuter } from "@/base";
import { getAccountAdministratorRole } from "../../selectors";

const StyledAPIKeyAdministratorInfo = styled(AlertOuter)`
    border-radius: 0;
    box-shadow: none;
    margin-bottom: 0;
    padding: 15px;

    p:last-of-type {
        margin: 0;
    }
`;

export const APIKeyAdministratorInfo = ({ administratorRole }) => {
    if (hasSufficientAdminRole(AdministratorRoles.BASE, administratorRole)) {
        return (
            <StyledAPIKeyAdministratorInfo color="purple">
                <div>
                    <p>
                        <strong>
                            You are an administrator and can create API keys with any permissions granted by that role.
                        </strong>
                    </p>
                    <p>
                        If your administrator role is reduced or removed, this API key will revert to your new limited
                        set of permissions.
                    </p>
                </div>
            </StyledAPIKeyAdministratorInfo>
        );
    }

    return null;
};

export const mapStateToProps = state => ({
    administratorRole: getAccountAdministratorRole(state),
});

export default connect(mapStateToProps)(APIKeyAdministratorInfo);
