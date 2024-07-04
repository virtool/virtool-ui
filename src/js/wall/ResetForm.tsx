import { RESET_PASSWORD } from "@app/actionTypes";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { InputError, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton, WallHeader, WallSubheader } from "./Container";
import { useResetPasswordMutation } from "./Queries";
import { WallTitle } from "./WallTitle";

type ResetFormProps = {
    /** Error message for the reset process. */
    error: string;
    /** Code required for password reset. */
    resetCode: string;
};

/** Handles the password reset process. */
export function ResetForm({ error, resetCode }: ResetFormProps) {
    const { register, handleSubmit } = useForm({ defaultValues: { password: "" } });
    const dispatch = useDispatch();
    const resetPasswordMutation = useResetPasswordMutation();

    function onSubmit({ password }) {
        resetPasswordMutation.mutate(
            { password, resetCode },
            {
                onSuccess: () => {
                    dispatch({ type: RESET_PASSWORD.SUCCEEDED });
                },
            },
        );
    }

    return (
        <>
            <WallTitle />
            <WallHeader>Password Reset</WallHeader>
            <WallSubheader>You are required to set a new password before proceeding.</WallSubheader>
            <form onSubmit={handleSubmit(onSubmit)}>
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

export default ResetForm;
