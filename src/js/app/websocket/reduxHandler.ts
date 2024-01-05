import { get } from "lodash-es/lodash";
import { wsInsertAnalysis, wsRemoveAnalysis, wsUpdateAnalysis } from "../../analyses/actions";
import { wsInsertGroup, wsRemoveGroup, wsUpdateGroup } from "../../groups/actions";
import { wsInsertHistory, wsInsertIndex, wsUpdateIndex } from "../../indexes/actions";
import { wsInsertJob, wsRemoveJob, wsUpdateJob } from "../../jobs/actions";
import { wsInsertOTU, wsRemoveOTU, wsUpdateOTU } from "../../otus/actions";
import { wsInsertReference, wsRemoveReference, wsUpdateReference } from "../../references/actions";
import { wsInsertSample, wsRemoveSample, wsUpdateSample } from "../../samples/actions";
import { wsUpdateStatus } from "../../status/actions";
import { wsRemoveSubtraction } from "../../subtraction/actions";
import { wsInsertUser, wsRemoveUser, wsUpdateUser } from "../../users/actions";

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

export function reduxHandler(store) {
    const dispatch = store.dispatch;
    const getState = store.getState;

    return function (message) {
        const { interface: iface, operation } = message;

        const modifier = get(modifiers, [operation, iface]);

        if (modifier) {
            const action = modifier(getState(), message);

            if (action) {
                return dispatch(action);
            }
        }
    };
}
