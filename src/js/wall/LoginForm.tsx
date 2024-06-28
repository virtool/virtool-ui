import { LOGIN } from "@app/actionTypes";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { BoxGroupSection, Checkbox, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton, WallHeader, WallSubheader } from "./Container";
import { useLoginMutation } from "./Queries";
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
    /** Error message for the login process. */
    error: string;
};

/** Handles the user login process. */
export function LoginForm({ error }: LoginFormProps) {
    const { control, handleSubmit, register } = useForm();
    const dispatch = useDispatch();
    const loginMutation = useLoginMutation();

    function onSubmit({ username, password, remember }) {
        loginMutation.mutate(
            { username, password, remember },
            {
                onSuccess: data => {
                    dispatch({ type: LOGIN.SUCCEEDED, payload: data });
                },
            },
        );
    }

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
                        {loginMutation.isError && <LoginError>{error}</LoginError>}
                    </LoginContainer>
                    <LoginButton type="submit" color="blue">
                        Login
                    </LoginButton>
                </form>
            </BoxGroupSection>
        </>
    );
}

export default LoginForm;
