import { get } from "lodash-es";
import { getAccountAdministratorRole, getAccountId } from "../account/selectors";
import { AdministratorRoles } from "../administration/types";
import { hasSufficientAdminRole } from "../administration/utils";
import { getTermSelectorFactory } from "../utils/selectors";

const getStateTerm = state => state.users.term;
export const getUsers = state => state.users.documents;
export const getTerm = getTermSelectorFactory(getStateTerm);

export const getUserDetailId = state => get(state, "users.detail.id");

export const getCanModifyUser = state => {
    const activeUserId = getAccountId(state);
    return (
        activeUserId &&
        hasSufficientAdminRole(AdministratorRoles.USERS, getAccountAdministratorRole(state)) &&
        activeUserId !== getUserDetailId(state)
    );
};
