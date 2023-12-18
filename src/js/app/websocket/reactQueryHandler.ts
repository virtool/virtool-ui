import { forEach } from "lodash-es";

import { QueryClient } from "react-query";
import { accountKeys } from "../../account/querys";
import { roleQueryKeys, userQueryKeys } from "../../administration/querys";
import { fileQueryKeys } from "../../files/querys";
import { groupQueryKeys } from "../../groups/querys";
import { indexQueryKeys } from "../../indexes/querys";
import { modelQueryKeys } from "../../ml/queries";
import { referenceQueryKeys } from "../../references/querys";
import { samplesQueryKeys } from "../../samples/querys";
import { taskUpdaters } from "./updaters";

/** Get affected resource query keys by workflow name  */
const workflowQueries = {
    build_index: [indexQueryKeys.lists()],
    create_sample: [samplesQueryKeys.lists()],
    pathoscope_bowtie: [samplesQueryKeys.lists()],
};

/**
 * Invalidate queries that are affected by a job update
 *
 * @param queryClient - The react-query client
 * @param message - The websocket message
 */
function jobUpdater(queryClient, data) {
    const queryKeys = workflowQueries[data.workflow];

    forEach(queryKeys, queryKey => {
        queryClient.invalidateQueries(queryKey);
    });
}

/**  Get resource keys from interface name */
const keyFactories = {
    account: accountKeys,
    groups: groupQueryKeys,
    indexes: indexQueryKeys,
    models: modelQueryKeys,
    roles: roleQueryKeys,
    uploads: fileQueryKeys,
    users: userQueryKeys,
    samples: samplesQueryKeys,
    references: referenceQueryKeys,
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
            queryClient.invalidateQueries(keyFactory.all());
        }

        if (iface === "jobs") {
            jobUpdater(queryClient, data);
        }

        if (iface === "tasks" && operation === "update") {
            taskUpdaters[data.type](queryClient, data);
        }
    };
}
