import { Permissions } from "@groups/types";

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

/**
 * Create permissions object with default false values
 *
 * @param permissions values to override the default automatically generated values
 * @returns Permissions object with fake data
 */
export function createFakePermissions(
    permissions?: Partial<Permissions>,
): Permissions {
    return {
        ...defaultPermissions,
        ...permissions,
    };
}
