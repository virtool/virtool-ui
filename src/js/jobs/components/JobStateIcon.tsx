import { Icon } from "@base/index";
import React from "react";
import { IconColor, JobState } from "../types";

function getIconName(state: JobState): string {
    switch (state) {
        case "waiting":
            return "clock";
        case "preparing":
            return "boxes";
        case "running":
            return "spinner";
        case "complete":
            return "check";
        case "timeout":
            return "hourglass-end";
        case "terminated":
            return "skull";
        case "error":
            return "exclamation-triangle";
        case "cancelled":
            return "ban";
    }
}

function getIconColor(state: JobState): IconColor {
    switch (state) {
        case "waiting":
            return "purple";
        case "preparing":
            return "grey";
        case "complete":
            return "green";
        default:
            return "red";
    }
}

interface JobStateIconProps {
    state: JobState;
}

export function JobStateIcon({ state }: JobStateIconProps) {
    return (
        <Icon
            name={getIconName(state)}
            color={getIconColor(state)}
            title={state}
        />
    );
}
