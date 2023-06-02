import { get } from "lodash-es";

export const getAccountAdministratorRole = state => get(state, "account.administrator_role", null);
