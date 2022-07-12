import { noop } from "lodash-es";
import { buffers, END, eventChannel } from "redux-saga";
import { call, put, take, takeEvery, throttle } from "redux-saga/effects";
import { FIND_FILES, REMOVE_FILE, UPLOAD } from "../app/actionTypes";
import { apiCall, putGenericError } from "../utils/sagas";
import { uploadFailed, uploadProgress } from "./actions";
import * as filesAPI from "./api";

export function* watchFiles() {
    yield throttle(100, FIND_FILES.REQUESTED, findFiles);
    yield takeEvery(REMOVE_FILE.REQUESTED, removeFile);
    yield takeEvery(UPLOAD.REQUESTED, upload);
}

export function* findFiles(action) {
    yield apiCall(filesAPI.list, action.payload, FIND_FILES, {
        fileType: action.payload.fileType
    });
}

export function* removeFile(action) {
    yield apiCall(filesAPI.remove, action.payload, REMOVE_FILE);
}

export function* upload(action) {
    const { localId } = action.payload;
    const channel = yield call(createUploadChannel, action.payload, filesAPI.upload);
    yield watchUploadChannel(channel, UPLOAD, localId);
}

export const createUploadChannel = (action, apiMethod) =>
    eventChannel(emitter => {
        const onProgress = e => {
            if (e.lengthComputable) {
                const { total, loaded, percent } = e;
                emitter({ progress: percent, total, loaded });
            }
        };

        const onSuccess = response => {
            emitter({ response });
            emitter(END);
        };

        const onFailure = err => {
            emitter({ err });
            emitter(END);
        };

        apiMethod({
            ...action,
            onProgress,
            onSuccess,
            onFailure
        });

        return noop;
    }, buffers.sliding(2));

export function* watchUploadChannel(channel, actionType, localId) {
    const startTime = new Date();
    let intervalStart = startTime;

    let lastProgress = 0;

    let progressAtLastIntervalEnd = 0;

    const intervalId = setInterval(() => {
        intervalStart = new Date();
        progressAtLastIntervalEnd = lastProgress;
    }, 5000);

    while (true) {
        const { progress = 0, total, loaded, response, err } = yield take(channel);

        lastProgress = progress;

        if (err) {
            yield put(uploadFailed(localId));
            yield putGenericError(actionType, err);
            break;
        }
        if (response) {
            yield put({
                type: actionType.SUCCEEDED,
                payload: {
                    ...response.body,
                    localId
                }
            });
            break;
        }

        const progressDuringInterval = lastProgress - progressAtLastIntervalEnd;
        const timeElapsed = new Date() - intervalStart;
        const uploadedDuringInterval = (progressDuringInterval / 100) * total;
        const uploadSpeed = uploadedDuringInterval / (timeElapsed / 1000);
        const remaining = (total - loaded) / uploadSpeed;

        yield put(uploadProgress(localId, progress, uploadSpeed, remaining));
    }

    clearInterval(intervalId);
}
