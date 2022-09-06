import React from "react";
import { Icon } from "../../../base";

export function JobAction({ state, canCancel, canArchive, onCancel, onArchive }) {
    if (state === "waiting" || state === "running") {
        if (canCancel) {
            return <Icon color="red" name="ban" onClick={onCancel} />;
        }

        return null;
    }

    if (canArchive) {
        return <Icon color="red" name="archive" onClick={onArchive} />;
    }

    return null;
}
