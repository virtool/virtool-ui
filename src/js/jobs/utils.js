export const getStepDescription = ({ state, step_name, step_description }) => {
    if (step_name && step_description) {
        return {
            title: step_name,
            description: step_description
        };
    }

    if (state === "waiting") {
        return {
            title: "Waiting",
            description: "Waiting for resources to become available."
        };
    }

    if (state === "preparing") {
        return {
            title: "Preparing",
            description: "Preparing the workflow environment."
        };
    }

    if (state === "complete") {
        return {
            title: "Complete",
            description: ""
        };
    }

    if (state === "cancelled") {
        return {
            title: "Cancelled",
            description: ""
        };
    }

    if (state === "terminated") {
        return {
            title: "Terminated",
            description: "There was a system malfunction"
        };
    }
    return {
        title: "",
        description: ""
    };
};
