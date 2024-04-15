import { get } from "lodash-es";

export const getJobDetailId = state => get(state, "jobs.detail.id");
export const getLinkedJobs = state => state.jobs.linkedJobs;
