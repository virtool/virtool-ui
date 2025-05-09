import { useFetchAccount } from "@account/queries";
import { AdministratorRoleName } from "@administration/types";
import { hasSufficientAdminRole } from "@administration/utils";
import { some } from "lodash-es";
import { useFetchSample } from "./queries";

/**
 * Determines if the current user has permission to edit a sample
 *
 * @param sampleId - The unique identifier of the sample to check permissions for
 * @returns whether the current user has permission to edit the sample
 */
export function useCheckCanEditSample(sampleId: string) {
    const { data: account, isPending: isPendingAccount } = useFetchAccount();
    const { data: sample, isPending: isPendingSample } =
        useFetchSample(sampleId);

    if (isPendingSample || isPendingAccount) {
        return { hasPermission: false, isPending: true };
    }

    const hasPermission =
        hasSufficientAdminRole(
            AdministratorRoleName.FULL,
            account.administrator_role,
        ) ||
        sample.all_write ||
        sample.user.id === account.id ||
        (sample.group_write && some(account.groups, { id: sample.group }));

    return { hasPermission, isPending: false };
}
