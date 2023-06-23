import { Permissions, UserNested } from "../users/types";

export type GroupMinimal = { id: string; name?: string };

export type groupNameUpdate = {
    id: string;
    name?: string;
};

export type groupPermissionsUpdate = {
    id: string;
    permissions: Permissions;
    value: boolean;
};

export type Group = GroupMinimal & {
    permissions: Permissions;
    users: UserNested[];
};
