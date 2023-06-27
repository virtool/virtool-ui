import { noop } from "lodash-es";
import { buffers, END, eventChannel } from "redux-saga";
import { call, put, take, takeEvery } from "redux-saga/effects";
import { UPLOAD } from "../app/actionTypes";
import { putGenericError } from "../utils/sagas";
import { uploadFailed, uploadProgress } from "./actions";
import * as filesAPI from "./api";

export function* watchFiles() {
    yield takeEvery(UPLOAD.REQUESTED, upload);
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
            onFailure,
        });

        return noop;
    }, buffers.sliding(2));

export function* watchUploadChannel(channel, actionType, localId) {
    let lastLoaded = 0;

    const loadedWindow = [];
    let count = 0;
    let uploadSpeed = 0;

    const intervalId = setInterval(() => {
        let loadedDuringInterval;

        if (count < 6) {
            loadedWindow.push(lastLoaded);
            loadedDuringInterval = loadedWindow[loadedWindow.length - 1];
            count++;
        } else {
            loadedWindow.shift();
            loadedWindow.push(lastLoaded);
            loadedDuringInterval = loadedWindow[loadedWindow.length - 1] - loadedWindow[0];
        }

        uploadSpeed = loadedDuringInterval / count;
    }, 1000);

    while (true) {
        const { progress = 0, total, loaded, response, err } = yield take(channel);

        lastLoaded = loaded;

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
                    localId,
                },
            });
            break;
        }

        let remaining = (total - loaded) / uploadSpeed;
        remaining = isFinite(remaining) ? remaining : 0;

        yield put(uploadProgress(localId, progress, uploadSpeed, remaining));
    }

    clearInterval(intervalId);
}
