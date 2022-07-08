import { map } from "lodash-es";
import { ArrayModel, Model, ObjectModel } from "objectmodel";

export const Permissions = Model({
    cancel_job: Boolean,
    create_ref: Boolean,
    create_sample: Boolean,
    modify_hmm: Boolean,
    modify_subtraction: Boolean,
    remove_file: Boolean,
    remove_job: Boolean,
    upload_file: Boolean
});

/**
 * @todo Remove group reformatting logic once API provides groups as objects by default
 */
export class Groups extends ArrayModel([String, { id: String }]) {
    constructor(groups) {
        super(map(groups, item => (typeof item === "string" ? item : { id: item })));
    }
}

export const User = ObjectModel({
    handle: String,
    administrator: Boolean,
    groups: Groups,
    permissions: Permissions,
    primary_group: [String],
    force_reset: Boolean,
    last_password_change: String,
    id: String
});
