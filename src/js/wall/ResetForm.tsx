import { get } from "lodash-es";
import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { resetPassword } from "../account/actions";
import { InputError, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton, WallHeader, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

type ResetFormProps = {
    /** Error message for the reset process. */
    error: string;
    /** Callback to handle password reset. */
    onReset: (password: string, resetCode: string) => void;
    /** Code required for password reset. */
    resetCode: string;
};

/** Handles the password reset process. */
export function ResetForm({ error, onReset, resetCode }: ResetFormProps) {
    const { register, handleSubmit } = useForm({ defaultValues: { password: "" } });

    return (
        <>
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
        </>
    );
}

export function mapStateToProps(state) {
    return {
        error: get(state, "errors.RESET_PASSWORD_ERROR.message"),
        resetCode: get(state, "app.resetCode"),
    };
}

export function mapDispatchToProps(dispatch) {
    return {
        onReset: (password, resetCode) => {
            dispatch(resetPassword(password, resetCode));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetForm);
