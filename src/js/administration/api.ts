import { Request } from "../app/request";

export function fetchSettings() {
    return Request.get("/settings").then(response => {
        return response.body;
    });
}
export function legacyFetchSettings() {
    return Request.get("/settings");
}

export function updateSettings(update) {
    return Request.patch("/settings").send(update);
}

export function fetchAdministratorRoles() {
    return Request.get("/admin/roles").then(response => response.body);
}

export function findUsers(page: number, per_page: number, term: string, administrator: boolean) {
    return Request.get("/admin/users")
        .query({ page, per_page, term, administrator })
        .then(response => {
            return response.body;
        });
}

export function setAdministratorRole(role: string, user_id: string) {
    return Request.put(`/admin/users/${user_id}/role`).send({ role });
}
