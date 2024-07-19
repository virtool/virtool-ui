import { get } from "lodash-es";
import { all, put, takeLatest } from "redux-saga/effects";
import { get as getAccountAPI } from "../account/api";
import { watchAccount } from "../account/sagas";
import { watchFiles } from "../files/sagas";
import { watchForm } from "../forms/sagas";
import { callWithAuthentication } from "../utils/sagas";
import { GET_INITIAL_STATE } from "./actionTypes";
import { root as rootAPI } from "./api";

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
    yield takeLatest(GET_INITIAL_STATE.REQUESTED, getInitialState);
}

/**
 * Yields all the sagas in the application. Intended for use with the ``react-saga`` middleware.
 *
 * @generator
 */
function* rootSaga() {
    yield all([watchAccount(), watchFiles(), watchRouter(), watchForm()]);
}

export default rootSaga;
