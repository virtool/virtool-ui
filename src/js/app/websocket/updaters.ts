import { assign } from "lodash-es";
import { forEach } from "lodash-es/lodash";
import { referenceQueryKeys } from "../../references/querys";

function taskSelector(data) {
    return data.task;
}

function infiniteListUpdater(data, selector) {
    return function (cache) {
        forEach(cache.pages, page => {
            forEach(page.documents, document => {
                if (document.task.id === data.id) {
                    assign(selector(document), data);
                }
            });
        });

        return cache;
    };
}

export function detailedUpdater(data, selector) {
    return function (cache) {
        if (data.id === selector(cache).id) {
            assign(selector(cache), data);
        }
    };
}

/** task id keyed functions for updating dependent resources  */
export const taskUpdaters = { clone_reference: referenceUpdater, remote_reference: referenceUpdater };

function referenceUpdater(queryClient, data) {
    queryClient.setQueriesData(referenceQueryKeys.infiniteList([]), infiniteListUpdater(data, taskSelector));
}
