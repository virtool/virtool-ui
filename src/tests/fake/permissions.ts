import { Permissions } from "../../js/users/types";

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

type createFakePermissionsProps = {
    cancel_job?: boolean;
    create_ref?: boolean;
    create_sample?: boolean;
    modify_hmm?: boolean;
    modify_subtraction?: boolean;
    remove_file?: boolean;
    remove_job?: boolean;
    upload_file?: boolean;
};

export const createFakePermissions = (permissions: createFakePermissionsProps): Permissions => ({
    ...defaultPermissions,
    ...permissions,
});
