import { analysesQueryKeys } from "@/analyses/queries";
import { accountKeys } from "@account/queries";
import { roleQueryKeys, userQueryKeys } from "@administration/queries";
import { fileQueryKeys } from "@files/queries";
import { groupQueryKeys } from "@groups/queries";
import { indexQueryKeys } from "@indexes/queries";
import { jobQueryKeys } from "@jobs/queries";
import { modelQueryKeys } from "@ml/queries";
import { referenceQueryKeys } from "@references/queries";
import { samplesQueryKeys } from "@samples/queries";
import { QueryClient } from "@tanstack/react-query";
import { forEach, get } from "lodash-es";
import { taskUpdaters } from "./updaters";

/** Get affected resource query keys by workflow name  */
const workflowQueries = {
    build_index: [indexQueryKeys.lists()],
    create_sample: [samplesQueryKeys.lists()],
    iimi: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
    nuvs: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
    pathoscope_bowtie: [samplesQueryKeys.lists(), analysesQueryKeys.lists()],
};

/**
 * Invalidate queries that are affected by a job update
 *
 * @param queryClient - The react-query client
 * @param message - The websocket message
 */
function jobUpdater(queryClient, data) {
    const queryKeys = workflowQueries[data.workflow];

    forEach(queryKeys, (queryKey) => {
        queryClient.invalidateQueries({ queryKey });
    });
}

/**  Get resource keys from interface name */
const keyFactories = {
    account: accountKeys,
    groups: groupQueryKeys,
    indexes: indexQueryKeys,
    jobs: jobQueryKeys,
    models: modelQueryKeys,
    references: referenceQueryKeys,
    roles: roleQueryKeys,
    uploads: fileQueryKeys,
    users: userQueryKeys,
    samples: samplesQueryKeys,
};

/**
 Create a handler for websocket messages that are related to react-query managed resources

 @param queryClient - The react-query client
 @returns A websocket message handler for react-query
 */

export function reactQueryHandler(queryClient: QueryClient) {
    /**
    Handle websocket messages related to react-query managed resources

    @param message - The websocket message
    */
    return function (message) {
        const { interface: iface, operation, data } = message;
        window.console.log(`${iface}.${operation}`);

        const keyFactory = keyFactories[iface];
        if (keyFactory) {
            queryClient.invalidateQueries({ queryKey: keyFactory.all() });
        }

        if (iface === "jobs") {
            jobUpdater(queryClient, data);
        }

        if (iface === "tasks" && operation === "update") {
            const updater = get(taskUpdaters, data.type);
            if (updater) {
                updater(queryClient, data);
            }
        }
    };
}
