import { getLocation, push } from "connected-react-router";
import { has, includes } from "lodash-es";
import { put, select, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import { pushState } from "../app/actions";
import {
    CREATE_SAMPLE,
    FIND_SAMPLES,
    GET_JOB,
    GET_LINKED_JOB,
    GET_SAMPLE,
    REMOVE_SAMPLE,
    UPDATE_SAMPLE,
    UPDATE_SAMPLE_RIGHTS,
    UPDATE_SEARCH,
    WS_UPDATE_JOB,
    WS_UPDATE_SAMPLE,
} from "../app/actionTypes";
import { deletePersistentFormState } from "../forms/actions";
import * as jobsAPI from "../jobs/api";
import { getJobDetailId, getLinkedJobs } from "../jobs/selectors";
import { apiCall, callWithAuthentication, putGenericError } from "../utils/sagas";
import { getSampleSucceeded } from "./actions";
import * as samplesAPI from "./api";
import { getLabelsFromURL, getSampleDetailId, getTermFromURL, getWorkflowsFromURL } from "./selectors";
import { createFindURL } from "./utils";

export function* watchSamples() {
    yield takeLatest(UPDATE_SEARCH, updateSearch);
    yield takeLatest(FIND_SAMPLES.REQUESTED, findSamples);
    yield takeLatest(GET_SAMPLE.REQUESTED, getSample);
    yield throttle(500, CREATE_SAMPLE.REQUESTED, createSample);
    yield takeEvery(UPDATE_SAMPLE.REQUESTED, updateSample);
    yield takeEvery(UPDATE_SAMPLE_RIGHTS.REQUESTED, updateSampleRights);
    yield throttle(300, REMOVE_SAMPLE.REQUESTED, removeSample);
    yield takeEvery(WS_UPDATE_SAMPLE, wsUpdateSample);
    yield takeLatest(WS_UPDATE_JOB, wsUpdateJob);
    yield takeLatest([WS_UPDATE_JOB], findSamples);
}

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

export function* wsUpdateSample(action) {
    const sampleDetailId = yield select(getSampleDetailId);
    if (action.payload.id === sampleDetailId) {
        yield apiCall(samplesAPI.get, { sampleId: sampleDetailId }, GET_SAMPLE);
    }
}

export function* updateSearch(action) {
    let { labels, term } = action.payload.parameters;

    if (labels === undefined) {
        labels = yield select(getLabelsFromURL);
    }

    if (term === undefined) {
        term = yield select(getTermFromURL);
    }

    const workflowsFromURL = yield select(getWorkflowsFromURL);

    const workflows = {
        ...workflowsFromURL,
        ...action.payload.parameters.workflows,
    };

    const { pathname, search } = createFindURL(term, labels, workflows);

    yield put(push(pathname + search));
}

export function* findSamples(action) {
    const routerLocation = yield select(getLocation);
    if (routerLocation.pathname === "/samples") {
        const term = yield select(getTermFromURL);
        const labels = yield select(getLabelsFromURL);

        const params = new URLSearchParams(routerLocation.search);
        yield apiCall(
            samplesAPI.find,
            { term, labels, workflows: params.get("workflows"), page: action.payload.page },
            FIND_SAMPLES,
        );
    }
}

export function* getSample(action) {
    try {
        const response = yield callWithAuthentication(samplesAPI.get, action.payload);

        const account = yield select(state => state.account);

        const data = response.body;

        const canModify =
            data.user.id === account.id || data.all_write || (data.group_write && includes(account.groups, data.group));
        yield put(getSampleSucceeded(data, canModify));
    } catch (error) {
        yield putGenericError(GET_SAMPLE, error);
    }
}

export function* createSample(action) {
    const resp = yield apiCall(samplesAPI.create, action.payload, CREATE_SAMPLE);

    if (resp.ok) {
        yield put(push("/samples"));
        yield put(deletePersistentFormState("create-sample"));
    }
}

export function* updateSample(action) {
    const resp = yield apiCall(samplesAPI.update, action.payload, UPDATE_SAMPLE);

    if (resp.ok) {
        yield put(pushState({ editSample: false }));
    }
}

export function* updateSampleRights(action) {
    yield apiCall(samplesAPI.updateRights, action.payload, UPDATE_SAMPLE_RIGHTS);
}

export function* removeSample(action) {
    const resp = yield apiCall(samplesAPI.remove, action.payload, REMOVE_SAMPLE);

    if (resp.ok) {
        yield put(push("/samples"));
    }
}
