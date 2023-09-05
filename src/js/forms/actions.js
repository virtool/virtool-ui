import { createAction } from "@reduxjs/toolkit";
import { DELETE_PERSISTENT_FORM_STATE, SET_PERSISTENT_FORM_STATE, SET_REDUX_FORM_STATE } from "../app/actionTypes";

export const setPersistentFormState = createAction(SET_PERSISTENT_FORM_STATE, (formName, formValues) => ({
    payload: { formName, formValues },
}));

export const deletePersistentFormState = createAction(DELETE_PERSISTENT_FORM_STATE, formName => ({
    payload: { formName },
}));

export const setReduxFormState = createAction(SET_REDUX_FORM_STATE, formState => ({
    payload: { formState },
}));
