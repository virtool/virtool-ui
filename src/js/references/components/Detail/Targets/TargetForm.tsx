import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Button,
    Checkbox,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    ModalFooter,
    TextArea,
} from "../../../../base";

type formValues = {
    name: string;
    description: string;
    length: number;
    required: boolean;
};

type TargetFormProps = {
    description?: string;
    error?: string;
    length?: number;
    name?: string;
    /** A callback function to add/edit a target */
    onSubmit: (values: formValues) => void;
    required?: boolean;
};

/**
 * Form for creating/editing a reference target
 */
export function TargetForm({ description, error, length, name, onSubmit, required }: TargetFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
        control,
    } = useForm<formValues>({
        defaultValues: {
            name: name || "",
            description: description || "",
            length: length || 0,
            required: required || false,
        },
    });

    return (
        <form onSubmit={handleSubmit(values => onSubmit({ ...values }))}>
            <InputGroup>
                <InputLabel htmlFor="name">Name</InputLabel>
                <InputSimple id="name" {...register("name", { required: "Required Field" })} />
                <InputError>{errors.name?.message || error}</InputError>
            </InputGroup>

            <InputGroup>
                <InputLabel htmlFor="description">Description</InputLabel>
                <TextArea id="description" {...register("description")} />
            </InputGroup>

            <InputGroup>
                <InputLabel htmlFor="length">Length</InputLabel>
                <InputSimple type="number" id="length" {...register("length")} />
            </InputGroup>
            <Controller
                name="required"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Checkbox label="Required" checked={value} onClick={() => onChange(!value)} />
                )}
            />

            <ModalFooter>
                <Button type="submit" icon="save" color="blue">
                    Submit
                </Button>
            </ModalFooter>
        </form>
    );
}
