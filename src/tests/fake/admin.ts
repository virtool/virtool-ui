import nock from "nock";
import { AdministratorRoles } from "../../js/administration/types";
import { User } from "../../js/users/types";

export const administratorRoles = [
    {
        description: "Manage who is an administrator and what they can do.",
        id: "full",
        name: "Full",
    },
    {
        description: "Manage instance settings and administrative messages.",
        id: "settings",
        name: "Settings",
    },
    {
        description: "Manage users in any space. Delete any space.",
        id: "spaces",
        name: "Spaces",
    },
    {
        description: "Create user accounts. Control activation of user accounts.",
        id: "users",
        name: "Users",
    },
    {
        description:
            "Provides ability to:\n     - Create new spaces even if the `Free Spaces` setting is not enabled.\n     - Manage HMMs and common references.\n     - View all running jobs.\n     - Cancel any job.\n    ",
        id: "base",
        name: "Base",
    },
];
export function mockGetAdministratorRoles() {
    return nock("http://localhost").get("/api/admin/roles").reply(200, administratorRoles);
}

type mockSetAdministratorRoleAPIProps = {
    user: User;
    new_role: AdministratorRoles;
};
export function mockSetAdministratorRoleAPI({ user, new_role }: mockSetAdministratorRoleAPIProps) {
    return nock("http://localhost").put(`/api/admin/users/${user.id}/role`, { role: new_role }).reply(200);
}
