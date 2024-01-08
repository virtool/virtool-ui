import React from "react";
import styled from "styled-components";
import { InputError, InputGroup, InputLabel, InputSimple } from "../../base";

const StyledInputGroup = styled(InputGroup)`
    padding-bottom: 0px;
`;

export function ReferenceForm({ errors, mode, register }) {
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
