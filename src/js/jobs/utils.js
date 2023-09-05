export function getStateTitle(state) {
    switch (state) {
        case "cancelled":
            return "Cancelled";
        case "complete":
            return "Complete";
        case "error":
            return "Error";
        case "preparing":
            return "Preparing";
        case "running":
            return "Running";
        case "terminated":
            return "Terminated";
        case "timeout":
            return "Timed Out";
        case "waiting":
            return "Waiting";
        default:
            return "";
    }
}

export function getStateDescription(state) {
    switch (state) {
        case "waiting":
            return "Waiting for resources to become available.";
        case "preparing":
            return "Preparing the workflow environment.";
        case "complete":
            return "";
        case "cancelled":
            return "";
        case "terminated":
            return "There was a system malfunction";
        case "timeout":
            return "The job timed out.";
        default:
            return "";
    }
}

export function getStepDescription({ state, step_name, step_description }) {
    if (step_name && step_description) {
        return {
            title: step_name,
            description: step_description,
        };
    }

    return {
        title: getStateTitle(state),
        description: getStateDescription(state),
    };
}
