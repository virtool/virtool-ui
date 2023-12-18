import { forEach, get } from "lodash-es";
import { wsInsertAnalysis, wsRemoveAnalysis, wsUpdateAnalysis } from "../analyses/actions";
import { wsInsertGroup, wsRemoveGroup, wsUpdateGroup } from "../groups/actions";
import { wsInsertHistory, wsInsertIndex, wsUpdateIndex } from "../indexes/actions";
import { wsInsertJob, wsRemoveJob, wsUpdateJob } from "../jobs/actions";
import { wsInsertOTU, wsRemoveOTU, wsUpdateOTU } from "../otus/actions";
import { wsInsertReference, wsRemoveReference, wsUpdateReference } from "../references/actions";
import { wsInsertSample, wsRemoveSample, wsUpdateSample } from "../samples/actions";
import { wsUpdateStatus } from "../status/actions";
import { wsInsertSubtraction, wsRemoveSubtraction, wsUpdateSubtraction } from "../subtraction/actions";
import { wsInsertTask, wsUpdateTask } from "../tasks/actions";
import { wsInsertUser, wsRemoveUser, wsUpdateUser } from "../users/actions";
import { resetClient } from "../utils/utils";

import { QueryClient } from "react-query";
import { accountKeys } from "../account/querys";
import { roleQueryKeys, userQueryKeys } from "../administration/querys";
import { fileQueryKeys } from "../files/querys";
import { groupQueryKeys } from "../groups/querys";
import { indexQueryKeys } from "../indexes/querys";
import { modelQueryKeys } from "../ml/queries";
import { referenceQueryKeys } from "../references/querys";
import { samplesQueryKeys } from "../samples/querys";

function infiniteListUpdater(data) {
    return function (cache) {
        console.log({ data, cache });
        forEach(cache.pages, page => {
            forEach(page.documents, document => {
                if (document.task.id === data.id) {
                    document.task = data;
                }
            });
        });

        return cache;
    };
}

function referenceUpdater(queryClient, data) {
    queryClient.setQueriesData(referenceQueryKeys.infiniteList([]), infiniteListUpdater(data));
}

/** Functions for updating task related resources */
const taskUpdaters = { clone_reference: referenceUpdater, remote_reference: referenceUpdater };

function taskUpdater(queryClient, data) {
    console.log("referenceUpdater", data);
    taskUpdaters[data.type](queryClient, data);

    console.log({ data });
}

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

function reactQueryHandler(queryClient: QueryClient) {
    /**
    Handle websocket messages related to react-query managed resources

    @param message - The websocket message
    */
    return function (message) {
        const { interface: iface, operation, data } = message;
        const keyFactory = keyFactories[iface];
        if (keyFactory) {
            queryClient.invalidateQueries(keyFactory.all());
        }

        if (iface === "jobs" && (operation === "update" || operation === "insert")) {
            jobUpdater(queryClient, data);
        }

        if (iface === "tasks" && operation === "update") {
            taskUpdater(queryClient, data);
        }
    };
}

function actionCreatorWrapper(actionCreator) {
    return (state, message) => actionCreator(message.data);
}

const inserters = {
    analyses: (state, message) => {
        const sampleId = get(state, "samples.detail.id");

        if (sampleId && sampleId === message.data.sample.id) {
            return wsInsertAnalysis(message.data);
        }
    },
    groups: actionCreatorWrapper(wsInsertGroup),
    history: actionCreatorWrapper(wsInsertHistory),
    indexes: actionCreatorWrapper(wsInsertIndex),
    jobs: actionCreatorWrapper(wsInsertJob),
    otus: actionCreatorWrapper(wsInsertOTU),
    references: actionCreatorWrapper(wsInsertReference),
    samples: actionCreatorWrapper(wsInsertSample),
    subtraction: actionCreatorWrapper(wsInsertSubtraction),
    tasks: actionCreatorWrapper(wsInsertTask),
    users: actionCreatorWrapper(wsInsertUser),
};

const updaters = {
    analyses: (state, message) => {
        const sampleId = get(state, "samples.detail.id");

        if (sampleId && sampleId === message.data.sample.id) {
            return wsUpdateAnalysis(message.data);
        }
    },
    groups: actionCreatorWrapper(wsUpdateGroup),
    indexes: actionCreatorWrapper(wsUpdateIndex),
    jobs: actionCreatorWrapper(wsUpdateJob),
    otus: actionCreatorWrapper(wsUpdateOTU),
    references: actionCreatorWrapper(wsUpdateReference),
    samples: actionCreatorWrapper(wsUpdateSample),
    status: actionCreatorWrapper(wsUpdateStatus),
    subtraction: actionCreatorWrapper(wsUpdateSubtraction),
    tasks: actionCreatorWrapper(wsUpdateTask),
    users: actionCreatorWrapper(wsUpdateUser),
};

const removers = {
    analyses: actionCreatorWrapper(wsRemoveAnalysis),
    groups: actionCreatorWrapper(wsRemoveGroup),
    jobs: actionCreatorWrapper(wsRemoveJob),
    otus: actionCreatorWrapper(wsRemoveOTU),
    references: actionCreatorWrapper(wsRemoveReference),
    samples: actionCreatorWrapper(wsRemoveSample),
    subtraction: actionCreatorWrapper(wsRemoveSubtraction),
    users: actionCreatorWrapper(wsRemoveUser),
};

const modifiers = {
    insert: inserters,
    create: inserters,
    update: updaters,
    delete: removers,
};

export const INITIALIZING = "initializing";
export const CONNECTING = "connecting";
export const CONNECTED = "connected";
export const ABANDONED = "abandoned";
export const RECONNECTING = "reconnecting";

export default function WSConnection(store, queryClient) {
    // The Redux store's dispatch method.
    this.dispatch = store.dispatch;

    this.getState = store.getState;

    this.reactQueryHandler = reactQueryHandler(queryClient);

    // When a websocket message is received, this method is called with the message as the sole argument. Every message
    // has a property "operation" that tells the dispatcher what to do. Illegal operation names will throw an error.
    this.handle = message => {
        // Reserved word 'interface'; don't use spread syntax.
        const iface = message.interface;
        const operation = message.operation;

        window.console.log(`${iface}.${operation}`);

        this.reactQueryHandler(message);

        const modifier = get(modifiers, [operation, iface]);

        if (modifier) {
            const action = modifier(this.getState(), message);

            if (action) {
                return this.dispatch(action);
            }
        }
    };

    this.interval = 500;
    this.connectionStatus = INITIALIZING;

    this.establishConnection = () => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";

        this.connection = new window.WebSocket(`${protocol}://${window.location.host}/ws`);
        this.connectionStatus = CONNECTING;

        this.connection.onopen = () => {
            this.interval = 500;
            this.connectionStatus = CONNECTED;
        };

        this.connection.onmessage = e => {
            this.handle(JSON.parse(e.data));
        };

        this.connection.onclose = e => {
            if (this.interval < 15000) {
                this.interval += 500;
            }

            if (e.code === 4000) {
                resetClient();
            }

            setTimeout(() => {
                this.establishConnection();
                this.connectionStatus = RECONNECTING;
            }, this.interval);
        };
    };
}
