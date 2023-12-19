import { forEach, get, assign } from "lodash-es/lodash";
import { InfiniteData, QueryClient } from "react-query";
import { hmmQueryKeys } from "../../hmm/querys";
import { HMMSearchResults } from "../../hmm/types";
import { referenceQueryKeys } from "../../references/querys";
import { ReferenceSearchResult } from "../../references/types";
import { Task } from "../../types";

interface TaskObject {
    task: Task;
}

/**
 * Default task selector for when the task is the root of the cached item
 *
 * @param cache - The item that task should be selected from
 * @returns The task located at the root of the cached item
 */
function taskSelector<T extends TaskObject>(cache: T): Task {
    return cache.task;
}


type Document = { items: TaskObject[] } | { documents: TaskObject[] };

/**
 * Update `Task`s in the list of items contained in an infinite list query
 *
 * @param data - The task data to update
 * @param selector - A function that returns the task from an instance of the cached item
 * @returns A function that updates the task in the cache
 */
function infiniteListItemUpdater<T extends Document>(task: Task, selector: (cache: TaskObject) => Task) {
    return function (cache: InfiniteData<T>): InfiniteData<T> {
        forEach(cache.pages, (page: T) => {
            const items = "items" in page ? page.items : page.documents;
            forEach(items, (item: { task: Task }) => {
                const previousTask = selector(item);
                if (previousTask && item.task.id === task.id) {
                    assign(previousTask, task);
                }
            });
        });

        return cache;
    };
}

/**
 * Update a task in the root of a cached item
 *
 * @param task - The new task data
 * @param selector - A function that returns the task from an instance of the cached item
 * @returns A function that updates the task in the cache
 */

export function updater<T>(task: Task, selector: (cache: T) => Task) {
    return function (cache: T): T {
        const previousTask = selector(cache);
        if (previousTask && previousTask.id === selector(cache).id) {
            assign(previousTask, task);
        }
        return cache;
    };
}

/**
 * `taskUpdaters` contains functions to update tasks in the cache.
 */
export const taskUpdaters = {
    clone_reference: referenceUpdater,
    remote_reference: referenceUpdater,
    install_hmms: HMMStatusUpdater,
};

/**
 * Update reference `Task`s in the cache of an infinite list query
 *
 * @param queryClient - The react-query client instance in use by the main application
 * @param task - The new task data to use for the update
 */
function referenceUpdater(queryClient: QueryClient, task: Task) {
    queryClient.setQueriesData(
        referenceQueryKeys.infiniteList([]),
        infiniteListItemUpdater<ReferenceSearchResult>(task, taskSelector),
    );
}

/**
 * Update the HMM status `Task` in the local cache
 *
 * @param queryClient - The react-query client instance in use by the main application
 * @param task - The new task data to use for the update
 */
function HMMStatusUpdater(queryClient: QueryClient, task: Task) {
    queryClient.setQueriesData(
        hmmQueryKeys.lists(),
        updater<HMMSearchResults>(task, item => get(item, "status.task")),
    );
}
