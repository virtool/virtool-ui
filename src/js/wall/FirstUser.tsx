import { useCreateFirstUser } from "@/users/queries";
import React from "react";
import { useForm } from "react-hook-form";
import { InputError, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

type FormValues = {
    username: string;
    password: string;
};

/**
 * A form for creating the first instance user
 */
export default function FirstUser() {
    const mutation = useCreateFirstUser();

    const { handleSubmit, register } = useForm<FormValues>();

    function onSubmit(data: FormValues) {
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
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <InputSimple
                                aria-label="username"
                                id="username"
                                defaultValue=""
                                {...register("username", { required: true })}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <InputSimple
                                aria-label="password"
                                id="password"
                                defaultValue=""
                                {...register("password", {
                                    required: "Password does not meet minimum length requirement (8)",
                                    minLength: {
                                        value: 8,
                                        message: "Password does not meet minimum length requirement (8)",
                                    },
                                })}
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
