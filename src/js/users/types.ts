import { AdministratorRoles } from "../administration/types";
import { GroupMinimal, Permissions } from "../groups/types";

/* Business to consumer specific details */
type UserB2C = {
    /* The display name (optional) */
    display_name?: string;
    /* The family name (optional) */
    family_name?: string;
    /* The given name (optional) */
    given_name?: string;
    /* The object ID */
    oid: string;
};

/* A user with the essential information */
export type UserNested = {
    /* Indicates if the user is an administrator */
    administrator: boolean;
    /* The unique identifier */
    id: string;
    /* The user's handle or username */
    handle: string;
};

/* A sample user */
export type User = UserNested & {
    /* Indicates if user is active */
    active: boolean;
    /* The B2C user information (optional) */
    b2c?: UserB2C;
    /* The user's display name (optional) */
    b2c_display_name?: string;
    /* The user's family name (optional) */
    b2c_family_name?: string;
    /* The user's given name (optional) */
    b2c_given_name?: string;
    /* The user's object ID (optional) */
    b2c_oid?: string;
    /* Indicates if the user is required to reset password */
    force_reset: boolean;
    /*  */
    groups: Array<GroupMinimal>;
    /* The date of the user's last password change */
    last_password_change: Date;
    /* The user's permissions */
    permissions: Permissions;
    /* The user's primary group */
    primary_group: GroupMinimal;
    /* THe role of the administrator user */
    administrator_role: AdministratorRoles;
};

/* A response containing a list of users */
export type UserResponse = {
    /* The array of user objects */
    items: Array<User>;
    /* The number of users found */
    found_count: number;
    /* The current page number */
    page: number;
    /* The total number of pages */
    page_count: number;
    /* The number of items per page */
    per_page: number;
    /* The total number of users */
    total_count: number;
};
