import Button from "../../base/Button";
import InputError from "../../base/InputError";
import InputGroup from "../../base/InputGroup";
import InputLabel from "../../base/InputLabel";
import InputSimple from "../../base/InputSimple";
import { useCreateFirstUser } from "../../users/queries";
import React from "react";
import { useForm } from "react-hook-form";
import { WallContainer } from "./WallContainer";
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
            <WallTitle
                title="Create First User"
                subtitle="Create an administrative user that can be used to configure your new Virtool instance."
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <InputSimple
                        aria-label="username"
                        id="username"
                        {...register("username", { required: true })}
                    />
                </InputGroup>
                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputSimple
                        aria-label="password"
                        id="password"
                        type="password"
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
                </InputGroup>

                <Button type="submit" color="blue">
                    Create User
                </Button>
                {mutation.isError && (
                    <InputError>
                        {mutation.error.response?.body.message}
                    </InputError>
                )}
            </form>
        </WallContainer>
    );
}
