import { AdministratorRoleName } from "@administration/types";
import { GroupMinimal, Permissions } from "../groups/types";
import { SearchResult } from "../types/api";

/** Business to consumer provided user details */
type UserB2c = {
    /** The display name */
    display_name?: string;

    /** The family name */
    family_name?: string;

    /** The given name */
    given_name?: string;

    /** The object ID */
    oid: string;
};

/** A user with the essential information */
export type UserNested = {
    /** The unique identifier */
    id: string;
    /** The user's handle or username */
    handle: string;
};

/** A Virtool user */
export type User = UserNested & {
    /** Their administrator role defining what resources they can modify */
    administrator_role: AdministratorRoleName;

    /** Indicates if user is active */
    active: boolean;

    /** Their B2C specific information */
    b2c?: UserB2c;

    /** Their display name */
    b2c_display_name?: string;

    /** Their family name */
    b2c_family_name?: string;

    /** Their given name */
    b2c_given_name?: string;

    /** Their B2C object ID */
    b2c_oid?: string;

    /** Whether the user will be forced to reset their password on next login */
    force_reset: boolean;

    /** A list of their groups */
    groups: Array<GroupMinimal>;

    /** The date of their last password change */
    last_password_change: string;

    /** Their permissions */
    permissions: Permissions;

    /** Their primary group */
    primary_group: GroupMinimal;
};

/** User search results from the API */
export type AdminUserResponse = SearchResult & {
    /** The page of users */
    items: Array<User>;
};

/** User search results from the API */
export type UserResponse = SearchResult & {
    /** The page of users */
    documents: Array<User>;
};