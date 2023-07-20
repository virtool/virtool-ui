import { UserNested } from "../users/types";

export type GroupMinimal = { id: string; name?: string };

export type Group = GroupMinimal & {
    permissions: Permissions;
    users: UserNested[];
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

export enum Permission {
    cancel_job = "cancel_job",
    create_ref = "create_ref",
    create_sample = "create_sample",
    modify_hmm = "modify_hmm",
    modify_subtraction = "modify_subtraction",
    remove_file = "remove_file",
    remove_job = "remove_job",
    upload_file = "upload_file",
}

type PermissionsUpdate = {
    cancel_job?: boolean;
    create_ref?: boolean;
    create_sample?: boolean;
    modify_hmm?: boolean;
    modify_subtraction?: boolean;
    remove_file?: boolean;
    remove_job?: boolean;
    upload_file?: boolean;
};

export type GroupUpdate = {
    id: string;
    name?: string;
    permissions?: PermissionsUpdate;
};
