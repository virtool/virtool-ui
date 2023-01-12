import { noop } from "lodash-es";
import { buffers, END, eventChannel } from "redux-saga";
import { call, put, select, take, takeEvery, throttle } from "redux-saga/effects";
import { FIND_FILES, REMOVE_FILE, UPLOAD, WS_INSERT_FILE, WS_REFRESH_FILES, WS_REMOVE_FILE } from "../app/actionTypes";
import { apiCall, callWithAuthentication, putGenericError } from "../utils/sagas";
import { uploadFailed, uploadProgress } from "./actions";
import * as filesAPI from "./api";
import { replace } from "connected-react-router";
import { updateSearchString } from "../utils/utils";

export function* watchFiles() {
    yield throttle(100, FIND_FILES.REQUESTED, findFiles);
    yield takeEvery(REMOVE_FILE.REQUESTED, removeFile);
    yield takeEvery(UPLOAD.REQUESTED, upload);
    yield throttle(500, [WS_INSERT_FILE, WS_REMOVE_FILE], handleWebsocket);
}

export function* handleWebsocket(action) {
    let { paginate, term, page, fileType } = yield select(state => state.files);

    if (fileType && (!action.payload?.fileType || fileType === action.payload?.type)) {
        const location = yield select(state => state.router.location);
        const params = new URLSearchParams(location.search);
        term = params.get("term") || term;
        page = params.get("page") || page || 1;

        let resp = yield callWithAuthentication(filesAPI.list, { page, term, paginate, fileType });

        const pageCount = resp.body.page_count;
        if (paginate && page > pageCount) {
            resp = yield callWithAuthentication(filesAPI.list, { page: pageCount, term, paginate, fileType });
            yield put(replace({ search: updateSearchString(location.search, { page: pageCount }) }));
        }

        yield put({ type: WS_REFRESH_FILES.SUCCEEDED, payload: resp.body, context: { fileType } });
    }
}

export function* findFiles(action) {
    let resp = yield callWithAuthentication(filesAPI.list, action.payload);

    const pageCount = resp.body.page_count;

    if (action.payload.paginate && action.payload.page > pageCount) {
        const location = yield select(state => state.router.location);
        resp = yield callWithAuthentication(filesAPI.list, { ...action.payload, page: pageCount });
        yield put(replace({ search: updateSearchString(location.search, { page: pageCount }) }));
    }

    yield put({ type: FIND_FILES.SUCCEEDED, payload: resp.body, context: { fileType: action.payload.fileType } });
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
    let lastLoaded = 0;

    const loadedWindow = [];
    let count = 0;
    let uploadSpeed = 0;

    const intervalId = setInterval(() => {
        let loadedDuringInterval = 0;
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
                    localId
                }
            });
            break;
        }

        let remaining = (total - loaded) / uploadSpeed;
        remaining = isFinite(remaining) ? remaining : 0;

        yield put(uploadProgress(localId, progress, uploadSpeed, remaining));
    }

    clearInterval(intervalId);
}
