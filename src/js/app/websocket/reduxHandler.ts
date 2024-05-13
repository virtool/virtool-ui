import { get } from "lodash-es/lodash";
import { wsUpdateAnalysis } from "../../analyses/actions";
import { wsInsertHistory, wsUpdateIndex } from "../../indexes/actions";
import { wsRemoveOTU, wsUpdateOTU } from "../../otus/actions";
import { wsUpdateReference } from "../../references/actions";

function actionCreatorWrapper(actionCreator) {
    return (state, message) => actionCreator(message.data);
}

const inserters = {
    history: actionCreatorWrapper(wsInsertHistory),
};

const updaters = {
    analyses: (state, message) => {
        const sampleId = get(state, "samples.detail.id");

        if (sampleId && sampleId === message.data.sample.id) {
            return wsUpdateAnalysis(message.data);
        }
    },
    indexes: actionCreatorWrapper(wsUpdateIndex),
    otus: actionCreatorWrapper(wsUpdateOTU),
    references: actionCreatorWrapper(wsUpdateReference),
};

const removers = {
    otus: actionCreatorWrapper(wsRemoveOTU),
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
