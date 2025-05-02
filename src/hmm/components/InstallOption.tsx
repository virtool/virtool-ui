import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import { Permission } from "@groups/types";
import React from "react";
import styled from "styled-components";
import Alert from "../../base/Alert";
import Button from "../../base/Button";
import { useInstallHmm } from "../queries";

const InstallOptionAlert = styled(Alert)`
    display: block;
    margin: 0;
`;

/**
 * Displays a button to initiate the installation of HMMs or displays an alert if the user lacks permission
 */
export default function InstallOption() {
    const { hasPermission: canInstall } = useCheckAdminRoleOrPermission(
        Permission.modify_hmm,
    );
    const mutation = useInstallHmm();

    return canInstall ? (
        <Button color="blue" onClick={() => mutation.mutate()}>
            Install
        </Button>
    ) : (
        <InstallOptionAlert color="orange">
            <strong>You do not have permission to install HMMs.</strong>
            <span> Contact an administrator.</span>
        </InstallOptionAlert>
    );
}
