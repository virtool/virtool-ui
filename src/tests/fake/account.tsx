import { faker } from "@faker-js/faker";
import nock from "nock";
import { Account, AccountSettings, QuickAnalyzeWorkflow } from "../../js/account/types";
import { AdministratorRoles } from "../../js/administration/types";
import { GroupMinimal } from "../../js/groups/types";
import { Permissions } from "../../js/users/types";
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
        email: email || faker.internet.email(),
        settings: { ...defaultSettings, ...settings },
        ...createFakeUser(userProps),
    };
}

export function mockGetAccountAPI(account: Account) {
    return nock("http://localhost").get("/api/account").reply(200, account);
}
