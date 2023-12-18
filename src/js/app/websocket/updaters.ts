import { assign } from "lodash-es";
import { forEach, get } from "lodash-es/lodash";
import { QueryClient } from "react-query";
import { hmmQueryKeys } from "../../hmm/querys";
import { referenceQueryKeys } from "../../references/querys";

/**
 * Default task selector for when the task is the root of the cached item
 *
 * @param data - The item that task should be selected from
 * @returns The task located at the root of the cached item
 */
function taskSelector(data: any) {
    return data.task;
}

/**
 * Update a task in the cache of an infinite list query
 *
 * @param data - The task data to update
 * @param selector - A function that returns the task from an instance of the cached item
 * @returns A function that updates the task in the cache
 */
function infiniteListDocumentUpdater(data, selector) {
    return function (cache) {
        forEach(cache.pages, page => {
            forEach(get(page, page.items ? "items" : "documents"), item => {
                if (item.task.id === data.id) {
                    assign(selector(item), data);
                }
            });
        });

        return cache;
    };
}

/**
 * Update a task located in
 *
 * @param data
 * @param selector
 */

export function detailedUpdater(data: any, selector: (data: any) => any) {
    return function (cache: any) {
        if (selector(cache) && data.id === selector(cache).id) {
            assign(selector(cache), data);
        }
        return cache;
    };
}

/** taskId keyed functions for updating dependent resources  */
export const taskUpdaters = {
    clone_reference: referenceUpdater,
    remote_reference: referenceUpdater,
    install_hmms: HMMStatusUpdater,
};

function referenceUpdater(queryClient: QueryClient, data: any) {
    queryClient.setQueriesData(referenceQueryKeys.infiniteList([]), infiniteListDocumentUpdater(data, taskSelector));
}

function HMMStatusUpdater(queryClient, data) {
    queryClient.setQueriesData(
        hmmQueryKeys.lists(),
        detailedUpdater(data, item => get(item, "status.task")),
    );
}
