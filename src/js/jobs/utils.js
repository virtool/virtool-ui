export const getStepDescription = step => {
    if (step.step_name && step.step_description) {
        return {
            title: step.step_name,
            description: step.step_description
        };
    }

    if (step.state === "waiting") {
        return {
            title: "Waiting",
            description: "Waiting for resources to become available."
        };
    }

    if (step.state === "preparing") {
        return {
            title: "Preparing",
            description: "Preparing the workflow environment."
        };
    }

    if (step.state === "complete") {
        return {
            title: "Complete",
            description: ""
        };
    }

    if (step.state === "cancelled") {
        return {
            title: "Cancelled",
            description: ""
        };
    }

    if (step.state === "terminated") {
        return {
            title: "Terminated",
            description: ""
        };
    }

    if (step.state === "error") {
        return {
            title: "Error",
            description: ""
        };
    }

    return {
        title: "",
        description: ""
    };
};
