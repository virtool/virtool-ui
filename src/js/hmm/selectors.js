<<<<<<< HEAD
import { find } from "lodash-es";

export function getTaskById(state, taskId) {
    const tasks = state.tasks.documents;
    if (taskId && tasks.length) {
        return find(tasks, { id: taskId });
    }
}
=======
import { find, get } from "lodash-es";
import { getTermSelectorFactory } from "../utils/selectors";

export const getStateTerm = state => state.hmms.term;

export const getTerm = getTermSelectorFactory(getStateTerm);

export const getTask = state => {
    const tasks = state.tasks.documents;
    const taskId = get(state.hmms.status, "task.id");
    if (taskId && tasks.length) {
        const task = find(tasks, { id: taskId });
        return task || undefined;
    }
};
>>>>>>> main
