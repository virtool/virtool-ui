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
        super(map(groups, group => (typeof group === "string" ? { id: group } : group)));
    }
}

/**
 * @todo Remove primary_group reformatting logic once API provides groups as objects by default
 */
export class User extends ObjectModel({
    handle: String,
    administrator: Boolean,
    groups: Groups,
    permissions: Permissions,
    primary_group: [String, { id: String }, null],
    force_reset: Boolean,
    last_password_change: String,
    id: String
}) {
    constructor(user) {
        super({
            ...user,
            primary_group: typeof user.primary_group === "string" ? { id: user.primary_group } : user.primary_group
        });
    }
}
