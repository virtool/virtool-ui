import { forEach } from "lodash-es";

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

export const getUpdatedURL = ({ searchParameters: { find, states } }) => {
    const url = new window.URL(window.location);
    if (typeof find === "string") {
        url.searchParams.delete("find");
        if (find) url.searchParams.append("find", find);
    }
    if (states) {
        url.searchParams.delete("state");
        forEach(states, state => url.searchParams.append("state", state));
    }
    return url;
};

export const getJobsSearchParamsFromURL = () => {
    const urlSearchParams = new window.URLSearchParams(window.location.search);
    const term = urlSearchParams.get("find");
    const states = urlSearchParams.getAll("state");
    return { term, states };
};
