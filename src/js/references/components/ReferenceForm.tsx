import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import { InputError, InputGroup, InputLabel, InputSimple, TextArea } from "../../base";
import { ReferenceDataType } from "../types";

const StyledInputGroup = styled(InputGroup)`
    padding-bottom: 0px;
`;

export enum ReferenceFormMode {
    edit = "edit",
    empty = "empty",
}

type FormValues = {
    name: string;
    description: string;
    dataType: ReferenceDataType;
    organism: string;
};

type ReferenceFormProps = {
    /** Form validation errors */
    errors: FieldErrors<FormValues>;
    /** The mode of the reference form */
    mode: ReferenceFormMode;
    /** Function to register form fields */
    register: UseFormRegister<FormValues>;
};

/**
 * Form input fields for organism, name and description
 */
export function ReferenceForm({ errors, mode, register }: ReferenceFormProps) {
    let organismComponent;

    if (mode === ReferenceFormMode.empty || mode === ReferenceFormMode.edit) {
        organismComponent = (
            <InputGroup>
                <InputLabel htmlFor="organism">Organism</InputLabel>
                <InputSimple id="organism" {...register("organism")} />
            </InputGroup>
        );
    }

    return (
        <>
            <StyledInputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <InputSimple id="name" {...register("name", { required: "Required Field" })} />
                <InputError>{errors.name?.message}</InputError>
            </StyledInputGroup>

            {organismComponent}

            <InputGroup>
                <InputLabel htmlFor="description">Description</InputLabel>
                <TextArea id="description" {...register("description")} />
            </InputGroup>
        </>
    );
}
