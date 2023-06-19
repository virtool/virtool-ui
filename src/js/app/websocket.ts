import { get } from "lodash-es";
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
import { LOGOUT } from "./actionTypes";

import { QueryClient } from "react-query";
import { accountKeys } from "../account/querys";
import { roleKeys, userKeys } from "../administration/querys";
import { fileKeys } from "../files/querys";

const keyFactories = {
    account: accountKeys,
    roles: roleKeys,
    users: userKeys,
    uploads: fileKeys,
};

const reactQueryHandler = (queryClient: QueryClient) => (iface, operation) => {
    const keyFactory = keyFactories[iface];
    if (keyFactory === undefined) return;
    queryClient.invalidateQueries(keyFactory.all);
};

const actionCreatorWrapper = actionCreator => {
    return (state, message) => actionCreator(message.data);
};

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

        this.reactQueryHandler(iface, operation);

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
                this.dispatch({ type: LOGOUT.SUCCEEDED });
                this.connectionStatus = ABANDONED;
                return;
            }

            setTimeout(() => {
                this.establishConnection();
                this.connectionStatus = RECONNECTING;
            }, this.interval);
        };
    };
}
