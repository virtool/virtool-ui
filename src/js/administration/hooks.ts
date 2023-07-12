import { useQuery } from "react-query";
import { useGetAccount } from "../account/querys";
import { Account } from "../account/types";
import { Request } from "../app/request";
import { AdministratorRoles } from "./types";
import { hasSufficientAdminRole } from "./utils";

function fetchSettings() {
    return Request.get("/settings").then(response => {
        return response.body;
    });
}

export function useFetchSettings() {
    return useQuery("settings", fetchSettings);
}

export function useCheckAdminRole(requiredRole: AdministratorRoles) {
    const { data: account, isLoading }: { data: Account; isLoading: boolean } = useGetAccount();
    return {
        hasPermission: account ? hasSufficientAdminRole(requiredRole, account.administrator_role) : null,
        isLoading,
    };
}
