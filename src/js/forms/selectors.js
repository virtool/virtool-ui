import { get } from "lodash-es";

export const getSingleFormValues = (state, formName) => get(state, ["forms", "formState", formName], null);
export const getAllFormState = state => state.forms.formState;
