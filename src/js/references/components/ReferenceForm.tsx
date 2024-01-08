import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";
import { InputError, InputGroup, InputLabel, InputSimple } from "../../base";
import { FormValues } from "./EmptyReference";

const StyledInputGroup = styled(InputGroup)`
    padding-bottom: 0px;
`;

type ReferenceFormProps = {
    /** Form validation errors */
    errors: FieldErrors<FormValues>;
    /** The mode of the reference form */
    mode: string;
    /** Function to register form fields */
    register: UseFormRegister<FormValues>;
};

/**
 * Form input fields for organism, name and description
 */
export function ReferenceForm({ errors, mode, register }: ReferenceFormProps) {
    let organismComponent;

    if (mode === "empty" || mode === "edit") {
        organismComponent = (
            <InputGroup>
                <InputLabel htmlFor="organism">Organism</InputLabel>
                <InputSimple as="textarea" id="organism" {...register("organism")} />
            </InputGroup>
        );
    }

    return (
        <>
            <StyledInputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <InputSimple id="name" {...register("name", { required: "Required Field." })} />
                <InputError>{errors.name?.message}</InputError>
            </StyledInputGroup>

            {organismComponent}

            <InputGroup>
                <InputLabel htmlFor="description">Description</InputLabel>
                <InputSimple as="textarea" id="description" {...register("description")} />
            </InputGroup>
        </>
    );
}
