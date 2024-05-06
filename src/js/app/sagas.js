import { getLocation, push } from "connected-react-router";
import { get } from "lodash-es";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { get as getAccountAPI } from "../account/api";
import { watchAccount } from "../account/sagas";
import { watchSettings } from "../administration/sagas";
import { watchAnalyses } from "../analyses/sagas";
import { watchDev } from "../dev/sagas";
import { watchFiles } from "../files/sagas";
import { watchForm } from "../forms/sagas";
import { watchIndexes } from "../indexes/sagas";
import { watchOTUs } from "../otus/sagas";
import { watchReferences } from "../references/sagas";
import { callWithAuthentication } from "../utils/sagas";
import { GET_INITIAL_STATE, PUSH_STATE } from "./actionTypes";
import { root as rootAPI } from "./api";

function* pushState(action) {
    const routerLocation = yield select(getLocation);
    yield put(push({ ...routerLocation, state: action.payload.state }));
}

function* getInitialState() {
    let login = false;

    try {
        yield callWithAuthentication(getAccountAPI, {});
    } catch (error) {
        const statusCode = get(error, "response.statusCode");
        if (statusCode === 401) {
            login = true;
        }
    }

    const rootResponse = yield callWithAuthentication(rootAPI, {});

    if (rootResponse.ok) {
        yield put({
            type: GET_INITIAL_STATE.SUCCEEDED,
            payload: {
                ...rootResponse.body,
                login,
            },
        });
    }
}

export function* watchRouter() {
    yield takeLatest(PUSH_STATE, pushState);
    yield takeLatest(GET_INITIAL_STATE.REQUESTED, getInitialState);
}

/**
 * Yields all the sagas in the application. Intended for use with the ``react-saga`` middleware.
 *
 * @generator
 */
function* rootSaga() {
    yield all([
        watchAccount(),
        watchAnalyses(),
        watchDev(),
        watchFiles(),
        watchIndexes(),
        watchOTUs(),
        watchRouter(),
        watchSettings(),
        watchReferences(),
        watchForm(),
    ]);
}

export default rootSaga;
