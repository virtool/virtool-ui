import { find } from "lodash-es";

export function getTaskById(state, taskId) {
    const tasks = state.tasks.documents;
    if (taskId && tasks.length) {
        return find(tasks, { id: taskId });
    }
}
