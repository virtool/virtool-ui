import { ErrorMessage, Field, FormikErrors, FormikTouched } from "formik";
import React from "react";
import * as Yup from "yup";
import { Input, InputError, InputGroup, InputLabel } from "../../base";
import { Accession } from "./Accession";
import SequenceField from "./Field";

export const validationSchema = Yup.object().shape({
    accession: Yup.string().required("Required Field"),
    definition: Yup.string().required("Required Field"),
    sequence: Yup.string()
        .uppercase()
        .required("Required Field")
        .matches(/^[:?ATCGNRYKM]+$/, "Sequence should only contain the characters: ATCGNRYKM"),
});

type formValues = {
    accession: string;
    definition: string;
    sequence: string;
};

type SequenceFormProps = {
    errors: FormikErrors<formValues>;
    touched: FormikTouched<formValues>;
};

/**
 * Displays a form for entering sequence-related information in adding/editing dialogs
 */
export function SequenceForm({ errors, touched }: SequenceFormProps) {
    return (
        <>
            <Accession error={touched.accession ? errors.accession : null} />

            <InputGroup>
                <InputLabel htmlFor="host">Host</InputLabel>
                <Field as={Input} name="host" id="host" />
            </InputGroup>

            <InputGroup>
                <InputLabel htmlFor="definition">Definition</InputLabel>
                <Field
                    as={Input}
                    name="definition"
                    id="definition"
                    error={touched.definition ? errors.definition : null}
                />
                <InputError>
                    <ErrorMessage name="definition" />
                </InputError>
            </InputGroup>

            <Field as={SequenceField} name="sequence" error={touched.sequence ? errors.sequence : null} />
        </>
    );
}
