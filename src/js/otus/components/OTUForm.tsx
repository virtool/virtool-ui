import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
    DialogFooter,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
} from "../../base";

const OTUFormBody = styled.div`
    display: grid;
    grid-template-columns: 9fr 4fr;
    grid-column-gap: ${(props) => props.theme.gap.column};
`;

type formValues = {
    name: string;
    abbreviation: string;
};

type OTUFormProps = {
    abbreviation?: string;
    /** Error message to be displayed */
    error: string;
    name?: string;
    /** A callback function to be called when the form is submitted */
    onSubmit: (values: formValues) => void;
};

/**
 * A form component for creating an OTU
 */
export function OTUForm({ abbreviation, error, name, onSubmit }: OTUFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<formValues>({
        defaultValues: { name: name || "", abbreviation: abbreviation || "" },
    });

    return (
        <form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
            <OTUFormBody>
                <InputGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputSimple
                        id="name"
                        {...register("name", { required: "Name required" })}
                    />
                    <InputError>{errors.name?.message || error}</InputError>
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="abbreviation">Abbreviation</InputLabel>
                    <InputSimple
                        id="abbreviation"
                        {...register("abbreviation")}
                    />
                </InputGroup>
            </OTUFormBody>
            <DialogFooter>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}
