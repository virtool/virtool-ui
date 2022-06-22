import { has } from "lodash-es";
import { select, takeEvery, takeLatest } from "redux-saga/effects";
import {
    ARCHIVE_JOB,
    CANCEL_JOB,
    FIND_JOBS,
    GET_JOB,
    GET_LINKED_JOB,
    WS_INSERT_JOB,
    WS_REMOVE_JOB,
    WS_UPDATE_JOB
} from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as jobsAPI from "./api";
import { getJobDetailId, getLinkedJobs, getTerm } from "./selectors";

export function* wsUpdateJob(action) {
    const jobId = action.payload.id;
    const jobDetailId = yield select(getJobDetailId);

    if (jobId === jobDetailId) {
        yield apiCall(jobsAPI.get, { jobId }, GET_JOB);
    }

    const linkedJobs = yield select(getLinkedJobs);

    if (has(linkedJobs, jobId)) {
        yield apiCall(jobsAPI.get, { jobId }, GET_LINKED_JOB);
    }
}

export function* getJobCount() {
    const term = yield select(getTerm);
    yield apiCall(jobsAPI.find, { term, archived: false }, FIND_JOBS);
}

export function* findJobs(action) {
    yield apiCall(jobsAPI.find, action.payload, FIND_JOBS);
    yield pushFindTerm(action.term);
}

export function* getJob(action) {
    yield apiCall(jobsAPI.get, action.payload, GET_JOB);
}

export function* getLinkedJob(action) {
    yield apiCall(jobsAPI.get, action.payload, GET_LINKED_JOB);
}

export function* cancelJob(action) {
    yield apiCall(jobsAPI.cancel, action.payload, CANCEL_JOB);
}

export function* archiveJob(action) {
    yield apiCall(jobsAPI.archive, action.payload, ARCHIVE_JOB);
}

export function* watchJobs() {
    yield takeLatest(FIND_JOBS.REQUESTED, findJobs);
    yield takeLatest(GET_JOB.REQUESTED, getJob);
    yield takeEvery(CANCEL_JOB.REQUESTED, cancelJob);
    yield takeEvery(ARCHIVE_JOB.REQUESTED, archiveJob);
    yield takeLatest(WS_UPDATE_JOB, wsUpdateJob);
    yield takeLatest([WS_INSERT_JOB, WS_REMOVE_JOB, WS_UPDATE_JOB], getJobCount);
    yield takeEvery(GET_LINKED_JOB.REQUESTED, getLinkedJob);
}
