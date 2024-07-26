import { RESET_PASSWORD } from "@app/actionTypes";
import { InputError, InputGroup, InputLabel, InputSimple } from "@base";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useResetPasswordMutation } from "../queries";
import { WallButton, WallHeader, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

type ResetFormProps = {
    /** Code required for password reset. */
    resetCode: string;
};

/** Handles the password reset process. */
export default function ResetForm({ resetCode }: ResetFormProps) {
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
            }
        );
    }

    const { error, isError } = resetPasswordMutation;

    return (
        <>
            <WallTitle />
            <WallHeader>Password Reset</WallHeader>
            <WallSubheader>You are required to set a new password before proceeding.</WallSubheader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <InputSimple id="password" type="password" {...register("password")} />
                    {isError && (
                        <InputError>
                            {error?.response?.body?.message || "An error occurred during password reset"}
                        </InputError>
                    )}
                </InputGroup>
                <WallButton type="submit" color="blue">
                    Reset
                </WallButton>
            </form>
        </>
    );
}
