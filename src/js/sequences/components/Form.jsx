import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";
import React from "react";
import * as Yup from "yup";
import { Input, InputContainer, InputError, InputGroup, InputLabel } from "../../base";
import { Accession } from "./Accession";
import SequenceField from "./Field";

export const validationSchema = Yup.object().shape({
    accession: Yup.string().required("Required Field"),
    definition: Yup.string().required("Required Field"),
    sequence: Yup.string()
        .uppercase()
        .required("Required Field")
        .matches(/^[:?ATCGN]+$/, "Sequence should only contain the characters: ATCGN"),
});

export const SequenceForm = ({ errors, touched }) => (
    <>
        <Accession error={touched.accession ? errors.accession : null} />

        <InputGroup>
            <InputLabel htmlFor="host">Host</InputLabel>
            <Field as={Input} name="host" id="host" />
        </InputGroup>

        <InputGroup>
            <InputLabel htmlFor="definition">Definition</InputLabel>
            <InputContainer>
                <Field
                    as={Input}
                    name="definition"
                    id="definition"
                    error={touched.definition ? errors.definition : null}
                />
                <InputError>
                    <ErrorMessage name="definition" />
                </InputError>
            </InputContainer>
        </InputGroup>

        <Field as={SequenceField} name="sequence" error={touched.sequence ? errors.sequence : null} />
    </>
);

SequenceForm.propTypes = {
    errors: PropTypes.objectOf(PropTypes.string).isRequired,
    touched: PropTypes.objectOf(PropTypes.bool).isRequired,
};
