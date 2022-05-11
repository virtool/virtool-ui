import { get, startCase } from "lodash-es";

export const getStepDescription = (stage, state, workflow) => {
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

    return get(stepDescriptions, [workflow, stage], {
        description: "",
        title: startCase(stage)
    });
};
