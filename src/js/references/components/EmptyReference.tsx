import { Form, Formik, FormikErrors, FormikTouched } from "formik";
import React from "react";
import * as Yup from "yup";
import { Alert, Button } from "../../base";
import { useCreateReference } from "../querys";
import { DataTypeSelection } from "./DataTypeSelection";
import { ReferenceForm } from "./Form";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
    dataType: Yup.string().required("Required Field"),
});

function getInitialState() {
    return {
        name: "",
        description: "",
        dataType: "genome",
        organism: "",
        mode: "empty",
    };
}

type formValues = {
    name: string;
    description: string;
    dataType: string;
    organism: string;
};

/**
 * A form for creating an empty reference
 */
export default function EmptyReference() {
    const mutation = useCreateReference();

    function handleSubmit({ name, description, dataType, organism }) {
        mutation.mutate({ name, description, dataType, organism });
    }

    return (
        <Formik initialValues={getInitialState()} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {({
                errors,
                touched,
                setFieldValue,
                values,
            }: {
                errors: FormikErrors<formValues>;
                touched: FormikTouched<formValues>;
                setFieldValue: (field: string, value: string) => void;
                values: formValues;
            }) => (
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
