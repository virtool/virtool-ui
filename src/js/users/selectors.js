import { get } from "lodash-es";
import { getAccountAdministratorRole, getAccountId } from "../account/selectors";
import { AdministratorRoles } from "../administration/types";
import { hasSufficientAdminRole } from "../administration/utils";
import { getTermSelectorFactory } from "../utils/selectors";

export function getStateTerm(state) {
    return state.users.term;
}

export function getUsers(state) {
    return state.users.documents;
}
export function getTerm() {
    return getTermSelectorFactory(getStateTerm);
}

export function getUserDetailId(state) {
    return get(state, "users.detail.id");
}

export function getCanModifyUser(state) {
    const activeUserId = getAccountId(state);

    return (
        activeUserId &&
        hasSufficientAdminRole(AdministratorRoles.USERS, getAccountAdministratorRole(state)) &&
        activeUserId !== getUserDetailId(state)
    );
}
