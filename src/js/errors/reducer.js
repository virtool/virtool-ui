/**
 * Exports a reducer for dealing with various request errors.
 *
 * @module errors/reducer
 */
import { createReducer } from "@reduxjs/toolkit";
import { endsWith, isEmpty, replace } from "lodash-es";
import {
    ADD_ISOLATE,
    ADD_SEQUENCE,
    CHANGE_ACCOUNT_PASSWORD,
    CLEAR_ERROR,
    CREATE_FIRST_USER,
    CREATE_GROUP,
    CREATE_INDEX,
    CREATE_OTU,
    CREATE_SAMPLE,
    CREATE_SUBTRACTION,
    CREATE_USER,
    EDIT_ISOLATE,
    EDIT_OTU,
    EDIT_SEQUENCE,
    EDIT_USER,
    FIND_USERS,
    GET_ANALYSIS,
    GET_HMM,
    GET_INDEX,
    GET_JOB,
    GET_OTU,
    GET_REFERENCE,
    GET_SAMPLE,
    GET_SUBTRACTION,
    GET_USER,
    LOGIN,
    UPDATE_ACCOUNT,
    UPDATE_SAMPLE,
    UPDATE_SETTINGS
} from "../app/actionTypes";
import { reportAPIError } from "../utils/utils";

/**
 * Checks whether supplied action is of failed action type,
 * and returns the action if it is, otherwise returns false.
 *
 * @func
 * @param action {object}
 * @returns {(object|boolean)}
 */
export const checkActionFailed = action => {
    const isFailed = endsWith(action.type, "_FAILED");
    return isFailed ? action : false;
};

/**
 * Returns the error field name from the failed action type.
 *
 * @func
 * @param action {object}
 * @returns {object}
 */
export const getErrorName = action => replace(action.type, "_FAILED", "_ERROR");

/**
 * Clears error if a new request is made for the same category.
 *
 * @func
 * @param action {object}
 * @returns {object}
 */
export const resetErrorName = action => {
    if (endsWith(action.type, "_REQUESTED")) {
        return replace(action.type, "_REQUESTED", "_ERROR");
    }
};

/**
 * A reducer for dealing with various request errors.
 *
 * @param state {object}
 * @param action {object}
 * @returns {object}
 */
export const errorsReducer = createReducer({}, builder => {
    builder
        .addCase(CLEAR_ERROR, (state, action) => {
            // Clear specific error explicitly
            state[action.payload.error] = null;
        })
        .addMatcher(
            action => checkActionFailed(action),
            (state, action) => {
                const errorName = getErrorName(action);

                const errorPayload = {
                    status: action.payload.status,
                    message: action.payload.message
                };
                switch (action.type) {
                    case CREATE_SAMPLE.FAILED:
                    case UPDATE_SAMPLE.FAILED:
                    case CREATE_OTU.FAILED:
                    case EDIT_OTU.FAILED:
                    case ADD_ISOLATE.FAILED:
                    case EDIT_ISOLATE.FAILED:
                    case ADD_SEQUENCE.FAILED:
                    case EDIT_SEQUENCE.FAILED:
                    case CREATE_INDEX.FAILED:
                    case CREATE_SUBTRACTION.FAILED:
                    case UPDATE_ACCOUNT.FAILED:
                    case CHANGE_ACCOUNT_PASSWORD.FAILED:
                    case CREATE_USER.FAILED:
                    case EDIT_USER.FAILED:
                    case CREATE_GROUP.FAILED:
                    case GET_JOB.FAILED:
                    case GET_SAMPLE.FAILED:
                    case GET_ANALYSIS.FAILED:
                    case GET_REFERENCE.FAILED:
                    case GET_OTU.FAILED:
                    case GET_HMM.FAILED:
                    case GET_INDEX.FAILED:
                    case GET_SUBTRACTION.FAILED:
                    case UPDATE_SETTINGS.FAILED:
                    case FIND_USERS.FAILED:
                    case GET_USER.FAILED:
                    case LOGIN.FAILED:
                        state[errorName] = errorPayload;
                        break;
                    case CREATE_FIRST_USER.FAILED:
                        state[errorName] = action.payload.error.response.body;
                        break;

                    default:
                        // Report uncaught errors to Sentry
                        reportAPIError(action);
                }
            }
        )
        .addDefaultCase((state, action) => {
            // Ignore requests until an error has occurred

            const errorName = isEmpty(state) ? null : resetErrorName(action);
            // Only clear errors on request that had been set previously
            if (errorName && state[errorName]) {
                state[errorName] = null;
            }
        });
});

export default errorsReducer;
