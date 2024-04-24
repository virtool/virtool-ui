import { getAccount } from "@account/selectors";
import { AdministratorRoles } from "@administration/types";
import { filter, find, get, includes, some } from "lodash-es";
import createCachedSelector from "re-reselect";
import { createSelector } from "reselect";

export const getReferenceDetail = state => get(state, "references.detail");
export const getReferenceDetailId = state => get(state, "references.detail.id");
export const getDataType = state => get(state, "references.detail.data_type");

/**
 * Check if the logged in account has the passed `right` on the reference detail is loaded for.
 *
 * @param {object} The application state
 * @param {string} The right to check for (eg. modify_otu)
 * @returns {boolean} Whether the right is possessed by the account
 */
export const checkReferenceRight = createCachedSelector(
    [getAccount, getReferenceDetail, (state, right) => right],
    (account, detail, right) => {
        if (account.administrator_role === AdministratorRoles.FULL) {
            return true;
        }

        if (detail === null) {
            return;
        }

        const user = find(detail.users, { id: account.id });

        if (user && user[right]) {
            return true;
        }

        // Groups user is a member of.
        const memberGroups = account.groups;

        // Groups in common between the user and the registered ref groups.
        const groups = filter(detail.groups, group => includes(memberGroups, group.id));

        if (!groups) {
            return false;
        }

        return some(groups, { [right]: true });
    },
)((state, right) => right);

/**
 * Given the application state, get a boolean indicating whether the logged in account can modify the OTUs of the
 * reference detail is loaded for.
 *
 * The result depends on the account's rights on the reference. It also depends on whether the reference is a remote
 * reference. Remote references cannot be modified by any user.
 *
 * @param {object} The application state
 * @returns {boolean} The OTU modification right of the account
 */
export const getCanModifyReferenceOTU = createSelector(
    [getReferenceDetail, state => checkReferenceRight(state, "modify_otu")],
    (detail, modifyOTU) => !detail.remotes_from && modifyOTU,
);
