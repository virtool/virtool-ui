import { faker } from "@faker-js/faker";
import nock from "nock";
import { Account, AccountSettings, QuickAnalyzeWorkflow } from "../../js/account/types";
import { AdministratorRoles } from "../../js/administration/types";
import { GroupMinimal, Permissions } from "../../js/groups/types";
import { createFakeUser } from "./user";

const defaultSettings = {
    quick_analyze_workflow: QuickAnalyzeWorkflow.pathoscope_bowtie,
    show_ids: true,
    show_versions: true,
    skip_quick_analyze_dialog: true,
};

type createFakeAccountProps = {
    permissions?: Permissions;
    groups?: Array<GroupMinimal>;
    primary_group?: GroupMinimal;
    handle?: string;
    administrator_role?: AdministratorRoles;
    settings?: AccountSettings;
    email?: string;
};

export function createFakeAccount(props?: createFakeAccountProps): Account {
    const { settings, email, ...userProps } = props || {};

    return {
        email: email === undefined ? faker.internet.email() : email,
        settings: { ...defaultSettings, ...settings },
        ...{ settings, email },
        ...createFakeUser(userProps),
    };
}

export function mockAPIGetAccount(account: Account) {
    return nock("http://localhost").get("/api/account").reply(200, account);
}
