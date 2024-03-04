import React from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from "styled-components";
import { useCheckAdminRoleOrPermission } from "../../administration/hooks";
import { Alert, Button } from "../../base";
import { Permission } from "../../groups/types";
import { install } from "../api";
import { hmmQueryKeys } from "../querys";

const InstallOptionAlert = styled(Alert)`
    display: block;
    margin: 0;
`;

/**
 * Displays a button to initiate the installation of HMMs or displays an alert if the user lacks permission
 */
export default function InstallOption() {
    const { hasPermission: canInstall } = useCheckAdminRoleOrPermission(Permission.modify_hmm);
    const queryClient = useQueryClient();
    const mutation = useMutation(install, {
        onSuccess: () => {
            queryClient.invalidateQueries(hmmQueryKeys.lists());
        },
    });

    return canInstall ? (
        <Button color="blue" icon="download" onClick={() => mutation.mutate()}>
            Install
        </Button>
    ) : (
        <InstallOptionAlert color="orange">
            <strong>You do not have permission to install HMMs.</strong>
            <span> Contact an administrator.</span>
        </InstallOptionAlert>
    );
}
