import { InputGroup, InputLabel, InputSimple } from "@base";
import Button from "@base/Button";
import Checkbox from "@base/Checkbox";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoginMutation } from "../queries";
import { WallTitle } from "./WallTitle";

type LoginFormProps = {
    /** Callback to set the reset code in the parent component state. */
    setResetCode: (resetCode: string) => void;
};

/** Handles the user login process. */
export default function LoginForm({ setResetCode }: LoginFormProps) {
    const { control, handleSubmit, register } = useForm();
    const loginMutation = useLoginMutation();

    function onSubmit({ username, password, remember }) {
        loginMutation.mutate(
            { username, password, remember },
            {
                onSuccess: (data) => {
                    if (data.body.reset_code) {
                        setResetCode(data.body.reset_code);
                    }
                },
            },
        );
    }

    const { error, isError } = loginMutation;

    return (
        <>
            <WallTitle
                title="Login"
                subtitle="Login with your Virtool account."
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <InputSimple
                        id="username"
                        {...register("username", { required: true })}
                        autoFocus
                    />
                </InputGroup>
                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputSimple
                        id="password"
                        type="password"
                        {...register("password", { required: true })}
                    />
                </InputGroup>
                <div className="flex justify-between my-4">
                    <Controller
                        name="remember"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Checkbox
                                checked={value}
                                id="RememberMe"
                                label="Remember Me"
                                onClick={() => onChange(!value)}
                            />
                        )}
                    />
                    {isError && (
                        <div className="flex text-red-500">
                            {error?.response?.body?.message ||
                                "An error occurred during login"}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <Button type="submit" color="blue">
                        Login
                    </Button>
                </div>
            </form>
        </>
    );
}
