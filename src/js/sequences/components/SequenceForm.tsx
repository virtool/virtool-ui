import { InputError, InputGroup, InputLabel, InputSimple } from "@base";
import { Accession } from "@sequences/components/Accession";
import SequenceField from "@sequences/components/SequenceField";
import React from "react";
import { useFormContext } from "react-hook-form";

type FormValues = {
    host: string;
    definition: string;
};

/**
 * Displays a form for entering sequence-related information in adding/editing dialogs
 */
export function SequenceForm() {
    const {
        formState: { errors },
        register,
    } = useFormContext<FormValues>();

    return (
        <>
            <Accession />

            <InputGroup>
                <InputLabel htmlFor="host">Host</InputLabel>
                <InputSimple id="host" {...register("host")} />
            </InputGroup>

            <InputGroup>
                <InputLabel htmlFor="definition">Definition</InputLabel>
                <InputSimple
                    id="definition"
                    {...register("definition", { required: "Required Field" })}
                />
                <InputError>{errors.definition?.message}</InputError>
            </InputGroup>

            <SequenceField />
        </>
    );
}
