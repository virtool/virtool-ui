import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Input, InputError, InputGroup, InputLabel, InputPassword } from "../base";
import { createFirst } from "../users/api";
import { User } from "../users/types";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

type ErrorResponse = {
    response: {
        body: {
            message: string;
        };
    };
};

type NewUser = {
    /** The user's handle or username */
    handle: string;
    /** The user's password */
    password: string;
    /** Whether the user will be forced to reset their password on next login */
    forceReset: boolean;
};

type FormData = {
    username: string;
    password: string;
};

/**
 * A form for creating the first instance user
 */
export default function FirstUser() {
    const mutation = useMutation<User, ErrorResponse, NewUser>(createFirst, {
        onSuccess: () => {
            window.location.reload();
        },
    });

    const { control, handleSubmit } = useForm<FormData>();

    function onSubmit(data: FormData) {
        mutation.mutate({
            handle: data.username,
            password: data.password,
            forceReset: false,
        });
    }

    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    <WallTitle />
                    <WallHeader>Setup First User</WallHeader>
                    <WallSubheader>
                        Create an administrative user that can be used to configure your new Virtool instance.
                    </WallSubheader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup>
                            <InputLabel>Username</InputLabel>
                            <Controller
                                name="username"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Username is required" }}
                                render={({ field }) => <Input type="text" autoFocus {...field} />}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel>Password</InputLabel>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Password is required" }}
                                render={({ field }) => <InputPassword {...field} />}
                            />
                        </InputGroup>

                        <WallButton type="submit" icon="user-plus" color="blue">
                            Create User
                        </WallButton>
                        {mutation.isError && <InputError>{mutation.error.response?.body.message}</InputError>}
                    </form>
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}
