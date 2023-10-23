import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Checkbox,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    ModalBody,
    ModalFooter,
    SaveButton,
} from "../../base";

interface CreateUserFormProps {
    /** The user's handle or username */
    handle?: string;
    /** The user's password */
    password?: string;
    /** Error message to be displayed */
    error: string;
    /** A callback function to be called when the form is submitted */
    onSubmit: (data: { handle: string; password: string; forceReset: boolean }) => void;
}

/**
 * A form component for creating a new user
 */
export function CreateUserForm({ handle = "", password = "", error, onSubmit }: CreateUserFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
        control,
    } = useForm({ defaultValues: { handle, password, forceReset: false } });

    return (
        <form onSubmit={handleSubmit(values => onSubmit({ ...values }))}>
            <ModalBody>
                <InputGroup>
                    <InputLabel htmlFor="handle">Username</InputLabel>
                    <InputSimple id="handle" {...register("handle", { required: "Please specify a username" })} />
                    <InputError>{errors.handle?.message}</InputError>
                </InputGroup>
                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputSimple
                        id="password"
                        type="password"
                        {...register("password", { required: "Password does not meet minimum length requirement (8)" })}
                    />
                    <InputError>{errors.password?.message || error}</InputError>
                </InputGroup>

                <Controller
                    name="forceReset"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            label="Force user to reset password on login"
                            checked={value}
                            onClick={() => onChange(!value)}
                        />
                    )}
                />
            </ModalBody>

            <ModalFooter>
                <SaveButton />
            </ModalFooter>
        </form>
    );
}
