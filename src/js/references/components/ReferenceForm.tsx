import { Field } from "formik";
import React from "react";
import styled from "styled-components";
import { Input, InputError, InputGroup, InputLabel, TextArea } from "../../base";

const StyledInputGroup = styled(InputGroup)`
    padding-bottom: 0px;
`;

export const ReferenceForm = ({ errors, touched, mode }) => {
    let organismComponent;

    if (mode === "empty" || mode === "edit") {
        organismComponent = (
            <InputGroup>
                <InputLabel htmlFor="organism">Organism</InputLabel>
                <Field as={Input} name="organism" id="organism" />
            </InputGroup>
        );
    }
    const nameError = touched.name && errors.name;

    return (
        <>
            <StyledInputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <Field name="name" id="name" as={Input} error={nameError} />
                <InputError>{nameError}</InputError>
            </StyledInputGroup>

            {organismComponent}

            <InputGroup>
                <InputLabel htmlFor="description">Description</InputLabel>
                <Field as={TextArea} name="description" id="description" />
            </InputGroup>
        </>
    );
};
