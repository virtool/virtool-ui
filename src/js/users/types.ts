import { AdministratorRoles } from "../administration/types";
import { GroupMinimal } from "../groups/types";

type UserB2C = {
    display_name?: string;
    family_name?: string;
    given_name?: string;
    oid: string;
};

export type User = {
    id: string;
    administrator: boolean;
    handle: string;
    active: boolean;
    b2c?: UserB2C;
    b2c_display_name?: string;
    b2c_family_name?: string;
    b2c_given_name?: string;
    b2c_oid?: string;
    force_reset: boolean;
    groups: Array<GroupMinimal>;
    last_password_change: Date;
    permissions: Permissions;
    primary_group: GroupMinimal;
    administrator_role: AdministratorRoles;
};

export type UserResponse = {
    items: Array<User>;
    found_count: number;
    page: number;
    page_count: number;
    per_page: number;
    total_count: number;
};

export type UserNested = {
    administrator: boolean;
    id: string;
    handle: string;
};

export type Permissions = {
    cancel_job: boolean;
    create_ref: boolean;
    create_sample: boolean;
    modify_hmm: boolean;
    modify_subtraction: boolean;
    remove_file: boolean;
    remove_job: boolean;
    upload_file: boolean;
};
