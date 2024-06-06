/**
 * Create a special action type used for requests.
 *
 * The request is an object with three properties assigned with action types used for API requests.
 *
 * - REQUESTED
 * - SUCCEEDED
 * - FAILED
 *
 * @param root {string} the root name of the action type
 * @returns {object} a request-style action type
 */
const createRequestActionType = root => ({
    REQUESTED: `${root}_REQUESTED`,
    SUCCEEDED: `${root}_SUCCEEDED`,
    FAILED: `${root}_FAILED`,
});

// App
export const GET_INITIAL_STATE = createRequestActionType("GET_INITIAL_STATE");

// Account
export const GET_ACCOUNT = createRequestActionType("GET_ACCOUNT");
export const UPDATE_ACCOUNT = createRequestActionType("UPDATE_ACCOUNT");
export const CHANGE_ACCOUNT_PASSWORD = createRequestActionType("CHANGE_ACCOUNT_PASSWORD");
export const LOGIN = createRequestActionType("LOGIN");
export const LOGOUT = createRequestActionType("LOGOUT");
export const RESET_PASSWORD = createRequestActionType("RESET_PASSWORD");

// Administration Settings
export const GET_SETTINGS = createRequestActionType("GET_SETTINGS");
export const UPDATE_SETTINGS = createRequestActionType("UPDATE_SETTINGS");

// Analysis
export const WS_UPDATE_ANALYSIS = "WS_UPDATE_ANALYSIS";
export const SET_ANALYSIS = "SET_ANALYSIS";
export const SET_ANALYSIS_ACTIVE_ID = "SET_ANALYSIS_ACTIVE_ID";
export const SET_SEARCH_IDS = "SET_SEARCH_IDS";
export const SET_AODP_FILTER = "ADD_AODP_FILTER";
export const SET_ANALYSIS_SORT_KEY = "SET_ANALYSIS_SORT_KEY";

// Errors
export const CLEAR_ERROR = "CLEAR_ERROR";

// Files
export const UPLOAD = createRequestActionType("UPLOAD");
export const UPLOAD_SAMPLE_FILE = createRequestActionType("UPLOAD_SAMPLE_FILE");
export const UPLOAD_PROGRESS = "UPLOAD_PROGRESS";
export const UPLOAD_FAILED = "UPLOAD_FAILED";
export const REMOVE_UPLOAD = "REMOVE_UPLOAD";

// Forms
export const SET_PERSISTENT_FORM_STATE = "SET_PERSISTENT_FORM_STATE";
export const DELETE_PERSISTENT_FORM_STATE = "DELETE_PERSISTENT_FORM_STATE";
export const SET_REDUX_FORM_STATE = "SET_REDUX_FORM_STATE";

// Groups
export const CREATE_GROUP = createRequestActionType("CREATE_GROUP");

// HMMs
export const GET_HMM = createRequestActionType("GET_HMM");

// Indexes
export const GET_INDEX = createRequestActionType("GET_INDEX");
export const CREATE_INDEX = createRequestActionType("CREATE_INDEX");

// Jobs
export const GET_JOB = createRequestActionType("GET_JOB");

// OTU
export const GET_OTU = createRequestActionType("GET_OTU");
export const CREATE_OTU = createRequestActionType("CREATE_OTU");
export const EDIT_OTU = createRequestActionType("EDIT_OTU");
export const ADD_ISOLATE = createRequestActionType("ADD_ISOLATE");
export const EDIT_ISOLATE = createRequestActionType("EDIT_ISOLATE");
export const ADD_SEQUENCE = createRequestActionType("ADD_SEQUENCE");
export const EDIT_SEQUENCE = createRequestActionType("EDIT_SEQUENCE");

// Refs
export const GET_REFERENCE = createRequestActionType("GET_REFERENCE");

// Samples
export const GET_SAMPLE = createRequestActionType("GET_SAMPLE");
export const CREATE_SAMPLE = createRequestActionType("CREATE_SAMPLE");
export const UPDATE_SAMPLE = createRequestActionType("UPDATE_SAMPLE");

// Subtraction
export const GET_SUBTRACTION = createRequestActionType("GET_SUBTRACTION");
export const CREATE_SUBTRACTION = createRequestActionType("CREATE_SUBTRACTION");

// Users
export const FIND_USERS = createRequestActionType("FIND_USERS");
export const GET_USER = createRequestActionType("GET_USER");
export const CREATE_USER = createRequestActionType("CREATE_USER");
export const CREATE_FIRST_USER = createRequestActionType("CREATE_FIRST_USER");
export const EDIT_USER = createRequestActionType("EDIT_USER");
