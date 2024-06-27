import { get } from "lodash-es";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { connect } from "react-redux";
import styled from "styled-components";
import { login } from "../account/actions";
import { BoxGroupSection, Checkbox, InputGroup, InputLabel, InputSimple } from "../base";
import { clearError } from "../errors/actions";
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

/**
 * Handles the user login process.
 *
 * @param {string} error - Error message for the login process.
 * @param {function} onLogin - Function to handle user login.
 */
export function LoginForm({ error, onLogin }) {
    const { control, handleSubmit, register } = useForm();

    return (
        <>
            <WallTitle />
            <WallHeader>Login</WallHeader>
            <BoxGroupSection>
                <WallSubheader>Sign in with your Virtool account</WallSubheader>
                <form
                    onSubmit={handleSubmit(({ username, password, remember }) => onLogin(username, password, remember))}
                >
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
                        <LoginError>{error}</LoginError>
                    </LoginContainer>
                    <LoginButton type="submit" color="blue">
                        Login
                    </LoginButton>
                </form>
            </BoxGroupSection>
        </>
    );
}

export function mapStateToProps(state) {
    return {
        error: get(state, "errors.LOGIN_ERROR.message"),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onChange: () => {
            dispatch(clearError("LOGIN_ERROR"));
        },
        onLogin: (username, password, remember) => {
            dispatch(login(username, password, remember));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
