import { get } from "lodash-es/lodash";
import { wsUpdateAnalysis } from "../../analyses/actions";

const updaters = {
    analyses: (state, message) => {
        const sampleId = get(state, "samples.detail.id");

        if (sampleId && sampleId === message.data.sample.id) {
            return wsUpdateAnalysis(message.data);
        }
    },
};

const modifiers = {
    update: updaters,
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
