import { Permissions } from "../../js/groups/types";

const defaultPermissions = {
    cancel_job: false,
    create_ref: false,
    create_sample: false,
    modify_hmm: false,
    modify_subtraction: false,
    remove_file: false,
    remove_job: false,
    upload_file: false,
};

type CreateFakePermissionsProps = {
    cancel_job?: boolean;
    create_ref?: boolean;
    create_sample?: boolean;
    modify_hmm?: boolean;
    modify_subtraction?: boolean;
    remove_file?: boolean;
    remove_job?: boolean;
    upload_file?: boolean;
};

/**
 * Create permissions object with default false values
 *
 * @param {CreateFakePermissionsProps} permissions values to override the default automatically generated values
 * @returns {Permissions} Permissions object with fake data
 */
export function createFakePermissions(
    permissions?: CreateFakePermissionsProps,
): Permissions {
    return {
        ...defaultPermissions,
        ...permissions,
    };
}
