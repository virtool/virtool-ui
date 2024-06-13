import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { useDidUpdateEffect } from "@utils/hooks";
import { isEqual } from "lodash-es";
import { setPersistentFormState } from "../actions";
import { getSingleFormValues } from "../selectors";
import { RestoredAlert } from "./Alert";

export const PersistForm = ({ castValues, formName, formValues, onSetPersistentFormState, resourceName }) => {
    const { setValues, values, initialValues, resetForm } = useFormikContext();
    const [hasRestored, sethasRestored] = useState(false);
    useEffect(() => {
        if (formValues && !isEqual(initialValues, formValues)) {
            const castFormData = castValues ? castValues(formValues) : formValues;
            sethasRestored(true);
            setValues(castFormData);
        }
    }, []);

    useDidUpdateEffect(() => {
        onSetPersistentFormState(formName, values);
    }, [values]);

    return <RestoredAlert hasRestored={hasRestored} resetForm={resetForm} name={resourceName} />;
};

export const mapStateToProps = (state, ownProps) => {
    return {
        formValues: getSingleFormValues(state, ownProps.formName),
    };
};

export const mapDispatchToProps = dispatch => ({
    onSetPersistentFormState: (formName, formValues) => {
        dispatch(setPersistentFormState(formName, formValues));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PersistForm);
