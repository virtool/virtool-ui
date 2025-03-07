import {
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
} from "@base";
import Checkbox from "@base/Checkbox";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";

const DialogFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

interface CreateUserFormProps {
    /** The user's handle or username */
    handle?: string;
    /** The user's password */
    password?: string;
    /** Error message to be displayed */
    error: string;
    /** A callback function to be called when the form is submitted */
    onSubmit: (data: {
        handle: string;
        password: string;
        forceReset: boolean;
    }) => void;
}

/**
 * A form component for creating a new user
 */
export function CreateUserForm({
    handle = "",
    password = "",
    error,
    onSubmit,
}: CreateUserFormProps) {
    const {
        formState: { errors },
        register,
        handleSubmit,
        control,
    } = useForm({ defaultValues: { handle, password, forceReset: false } });

    return (
        <form onSubmit={handleSubmit((values) => onSubmit({ ...values }))}>
            <InputGroup>
                <InputLabel htmlFor="handle">Username</InputLabel>
                <InputSimple
                    id="handle"
                    autoComplete="username"
                    {...register("handle", {
                        required: "Please specify a username",
                    })}
                />
                <InputError>{errors.handle?.message}</InputError>
            </InputGroup>
            <InputGroup>
                <InputLabel htmlFor="password">Password</InputLabel>
                <InputSimple
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register("password", {
                        required:
                            "Password does not meet minimum length requirement (8)",
                        minLength: {
                            value: 8,
                            message:
                                "Password does not meet minimum length requirement (8)",
                        },
                    })}
                />
                <InputError>{errors.password?.message || error}</InputError>
            </InputGroup>

            <DialogFooter>
                <Controller
                    name="forceReset"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                            checked={value}
                            id="ForceReset"
                            label="Force user to reset password on login"
                            onClick={() => onChange(!value)}
                        />
                    )}
                />
                <SaveButton />
            </DialogFooter>
        </form>
    );
}
