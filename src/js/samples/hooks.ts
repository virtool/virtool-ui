import { some } from "lodash-es";
import { useFetchAccount } from "../account/querys";
import { AdministratorRoles } from "../administration/types";
import { hasSufficientAdminRole } from "../administration/utils";
import { useFetchSample } from "./querys";

/**
 * Determines if the current user has permission to edit a sample
 *
 * @param sampleId - The unique identifier of the sample to check permissions for
 * @returns whether the current user has permission to edit the sample
 */
export function useCheckCanEditSample(sampleId: string) {
    const { data: account, isLoading: isAccountLoading } = useFetchAccount();
    const { data: sample, isLoading: isSampleLoading } = useFetchSample(sampleId);

    if (isSampleLoading || isAccountLoading) {
        return { hasPermission: false, isLoading: true };
    }

    const hasPermission =
        hasSufficientAdminRole(AdministratorRoles.FULL, account.administrator_role) ||
        sample.all_write ||
        sample.user.id === account.id ||
        (sample.group_write && some(account.groups, { id: sample.group }));

    return { hasPermission, isLoading: false };
}
