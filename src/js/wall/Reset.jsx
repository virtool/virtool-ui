import { get } from "lodash-es";
import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { resetPassword } from "../account/actions";
import { InputError, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

export function Reset({ error, onReset, resetCode }) {
    const { register, handleSubmit } = useForm({ defaultValues: { password: "" } });

    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    <WallTitle />
                    <WallHeader>Password Reset</WallHeader>
                    <WallSubheader>You are required to set a new password before proceeding.</WallSubheader>

                    <form onSubmit={handleSubmit(values => onReset(values.password, resetCode))}>
                        <InputGroup>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <InputSimple id="password" type="password" {...register("password")} />
                            <InputError>{error}</InputError>
                        </InputGroup>
                        <WallButton type="submit" color="blue">
                            Reset
                        </WallButton>
                    </form>
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}

export const mapStateToProps = state => ({
    error: get(state, "errors.RESET_PASSWORD_ERROR.message"),
    resetCode: get(state, "app.resetCode"),
});

export const mapDispatchToProps = dispatch => ({
    onReset: (password, resetCode) => {
        dispatch(resetPassword(password, resetCode));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Reset);
