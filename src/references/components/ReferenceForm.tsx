import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import TextArea from "@base/TextArea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styled from "styled-components";

const StyledInputGroup = styled(InputGroup)`
    padding-bottom: 0;
`;

export enum ReferenceFormMode {
    edit = "edit",
    empty = "empty",
}

type FormValues = {
    name: string;
    description: string;
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
                <InputSimple
                    id="name"
                    {...register("name", { required: "Required Field" })}
                />
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
