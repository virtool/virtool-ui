import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
    const [forceReset, setForceReset] = useState(false);

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm({ defaultValues: { handle, password, forceReset } });

    function handleForceReset() {
        forceReset ? setForceReset(false) : setForceReset(true);
    }

    return (
        <form onSubmit={handleSubmit(values => onSubmit({ ...values, forceReset: forceReset || false }))}>
            <ModalBody>
                <InputGroup>
                    <InputLabel htmlFor="handle">Username</InputLabel>
                    <InputSimple id="handle" {...register("handle", { required: "Please specify a username." })} />
                    <InputError>{errors.handle?.message}</InputError>
                </InputGroup>
                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputSimple
                        id="password"
                        type="password"
                        {...register("password", { required: "Please specify a password." })}
                    />
                    <InputError>{error}</InputError>
                </InputGroup>

                <Checkbox
                    label="Force user to reset password on login"
                    checked={forceReset}
                    onClick={handleForceReset}
                />
            </ModalBody>

            <ModalFooter>
                <SaveButton />
            </ModalFooter>
        </form>
    );
}
