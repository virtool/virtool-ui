/**
 * Utility functions for working with sagas.
 *
 * @module sagaUtils
 */
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { replace } from "connected-react-router";
import { get, includes } from "lodash-es";
import { put } from "redux-saga/effects";
import { LOGOUT } from "../app/actionTypes";
import { getProtectedResources } from "../app/authConfig";
import { createFindURL } from "./utils";

/**
 * Gets access token for b2c authentication
 * @returns {token} JWT access token for B2C
 */
export function getAccessToken() {
    const protectedResources = getProtectedResources();
    const account = window.msalInstance.getActiveAccount();
    return window.msalInstance
        .acquireTokenSilent({
            scopes: protectedResources.backendApi.scopes,
            account
        })
        .then(response => {
            return response.accessToken;
        })
        .catch(error => {
            if (error instanceof InteractionRequiredAuthError) {
                window.msalInstance
                    .acquireTokenPopup({
                        scopes: protectedResources.backendApi.scopes
                    })
                    .then(response => {
                        return response.accessToken;
                    })
                    .catch(error => console.log(error));
            }
        });
}

/**
 * Add B2c authentication if appropriate then executes an API call
 *
 * @generator
 * @param apiMethod {function} the function to call with ``action``
 * @param action {object} an action to pass to ``apiMethod``
 */
export function* callWithAuthentication(apiMethod, action) {
    if (window.b2c.use && window.msalInstance.getActiveAccount()) {
        const accessToken = yield getAccessToken();
        return yield apiMethod(action).set("Bearer", accessToken);
    }
    return yield apiMethod(action);
}

/**
 * Executes an API call by calling ``apiMethod`` with ``action``.
 *
 * If the call succeeds an action with ``actionType.SUCCEEDED`` and a ``data`` property is dispatched.
 *
 * If the call fails an action with ``actionType.FAILED`` and generic error properties is dispatched.
 *
 * @generator
 * @param apiMethod {function} the function to call with ``action``
 * @param action {object} an action to pass to ``apiMethod``
 * @param actionType {object} a request-style action type
 * @param context {object} data to assign to the `context` property of the action
 */
export function* apiCall(apiMethod, action, actionType, context = {}) {
    try {
        const response = yield callWithAuthentication(apiMethod, action);
        yield put({ type: actionType.SUCCEEDED, payload: response.body, context });
        return response;
    } catch (error) {
        const statusCode = get(error, "response.statusCode");

        if (statusCode === 401) {
            yield put({
                type: LOGOUT.SUCCEEDED
            });
            return error.response;
        }

        if (get(error, "response.body")) {
            yield putGenericError(actionType, error);
            return error.response;
        }

        throw error;
    }
}

export function* pushFindTerm(term, contains) {
    const url = createFindURL(term);

    if (!contains || includes(url.pathname, contains)) {
        yield put(replace(url.pathname + url.search));
    }
}

/**
 * Should be called in the event of an HTTP error during an API call. Dispatches a ``FAILED`` request-style action
 * containing data related to the HTTP error.
 *
 * @generator
 * @param actionType {object} a request-style action type
 * @param error {object} the HTTP error from Superagent
 */
export function* putGenericError(actionType, error) {
    const { body, status } = error.response ? error.response : {};

    const message = body ? body.message : null;
    yield put({
        type: actionType.FAILED,
        payload: { message, error, status }
    });
}
