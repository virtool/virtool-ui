import React from "react";
import { Icon } from "../../../base";

export function JobAction({ state, canCancel, canRemove, onCancel, onRemove }) {
    if (state === "waiting" || state === "running") {
        if (canCancel) {
            return <Icon color="red" name="ban" onClick={onCancel} />;
        }

        return null;
    }

    if (canRemove) {
        return <Icon color="red" name="trash" onClick={onRemove} />;
    }

    return null;
}
