import { Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import { Alert, Button } from "../../base";
import { emptyReference } from "../actions";
import { DataTypeSelection } from "./DataTypeSelection";
import { ReferenceForm } from "./Form";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
    dataType: Yup.string().required("Required Field"),
});

const getInitialState = () => ({
    name: "",
    description: "",
    dataType: "genome",
    organism: "",
    mode: "empty",
});

export function EmptyReference({ onSubmit }) {
    function handleSubmit({ name, description, dataType, organism }) {
        onSubmit(name, description, dataType, organism);
    }

    return (
        <Formik initialValues={getInitialState()} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {({ errors, touched, setFieldValue, values }) => (
                <Form>
                    <Alert>
                        <strong>Create an empty reference.</strong>
                    </Alert>
                    <ReferenceForm errors={errors} touched={touched} mode={"empty"} />
                    <DataTypeSelection
                        onSelect={datatype => setFieldValue("dataType", datatype)}
                        dataType={values.dataType}
                    />
                    <Button type="submit" icon="save" color="blue">
                        Save
                    </Button>
                </Form>
            )}
        </Formik>
    );
}

export const mapDispatchToProps = dispatch => ({
    onSubmit: (name, description, dataType, organism) => {
        dispatch(emptyReference(name, description, dataType, organism));
    },
});

export default connect(null, mapDispatchToProps)(EmptyReference);
