import { BoxGroupSection, Checkbox, InputGroup, InputLabel, InputSimple } from "@base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { useLoginMutation } from "../queries";
import { WallButton, WallHeader, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

const LoginError = styled.div`
    color: red;
    margin-left: auto;
    margin-bottom: 10px;
    font-size: 12px;
    height: 10px;
`;

const LoginButton = styled(WallButton)`
    margin-top: 20px;
`;

const LoginContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`;

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
                onSuccess: data => {
                    if (data.body.resetCode) {
                        setResetCode(data.body.resetCode);
                    }
                },
            }
        );
    }

    const { error, isError } = loginMutation;

    return (
        <>
            <WallTitle />
            <WallHeader>Login</WallHeader>
            <BoxGroupSection>
                <WallSubheader>Sign in with your Virtool account</WallSubheader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <InputSimple id="username" {...register("username", { required: true })} autoFocus />
                    </InputGroup>
                    <InputGroup>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <InputSimple id="password" type="password" {...register("password", { required: true })} />
                    </InputGroup>
                    <LoginContainer>
                        <Controller
                            name="remember"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox checked={value} onClick={() => onChange(!value)} label="Remember Me" />
                            )}
                        />
                        {isError && (
                            <LoginError>
                                {error?.response?.body?.message || "An error occurred during login"}
                            </LoginError>
                        )}
                    </LoginContainer>
                    <LoginButton type="submit" color="blue">
                        Login
                    </LoginButton>
                </form>
            </BoxGroupSection>
        </>
    );
}
