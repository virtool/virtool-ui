import { UserNested } from "../users/types";

export type GroupMinimal = { id: string; name?: string };

export type groupNameUpdate = {
    id: string;
    name?: string;
};

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
