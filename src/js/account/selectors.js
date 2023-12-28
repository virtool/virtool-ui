import { get } from "lodash-es";

export const getAccount = state => state.account;
export const getAccountAdministratorRole = state => get(state, "account.administrator_role", null);

export const getAccountId = state => state.account.id;
export const getAccountHandle = state => state.account.handle;
