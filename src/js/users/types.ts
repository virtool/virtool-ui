import { AdministratorRoles } from "../administration/types";
import { GroupMinimal, Permissions } from "../groups/types";
import { SearchResult } from "../utils/types";

/** Business to consumer provided user details */
type UserB2C = {
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
    /** Indicates if the user is an administrator */
    administrator: boolean;
    /** The unique identifier */
    id: string;
    /** The user's handle or username */
    handle: string;
};

/** A Virtool user */
export type User = UserNested & {
    /** Indicates if user is active */
    active: boolean;
    /** Their B2C specific information */
    b2c?: UserB2C;
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
    /** The iso formatted date of their last password change */
    last_password_change: string;
    /** Their permissions */
    permissions: Permissions;
    /** Their primary group */
    primary_group: GroupMinimal;
    /** Their administrator role defining what resources they can modify */
    administrator_role: AdministratorRoles;
};

/** User search results from the API */
export type UserResponse = SearchResult & {
    /** The page of users */
    items: Array<User>;
};
