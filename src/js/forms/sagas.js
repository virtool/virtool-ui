import { put, select, takeLatest, throttle } from "redux-saga/effects";
import { DELETE_PERSISTENT_FORM_STATE, SET_PERSISTENT_FORM_STATE } from "../app/actionTypes";
import { setSessionStorage } from "../utils/utils";
import { setReduxFormState } from "./actions";
import { getAllFormState } from "./selectors";

export function* setPersistentFormState({ payload: { formName, formValues } }) {
    const previousFormState = yield select(getAllFormState);
    const formState = { ...previousFormState, [formName]: formValues };
    setSessionStorage("formState", formState);
    yield put(setReduxFormState(formState));
}

export function* deletePersistentFormState({ payload: { formName } }) {
    yield setPersistentFormState({ payload: { formName, formValues: null } });
}

export function* watchForm() {
    yield throttle(500, SET_PERSISTENT_FORM_STATE, setPersistentFormState);
    yield takeLatest(DELETE_PERSISTENT_FORM_STATE, deletePersistentFormState);
}
