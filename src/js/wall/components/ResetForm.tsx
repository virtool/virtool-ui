import { Button, InputError, InputGroup, InputLabel, InputSimple } from "@base";
import React from "react";
import { useForm } from "react-hook-form";
import { useResetPasswordMutation } from "../queries";
import { WallTitle } from "./WallTitle";

type ResetFormProps = {
    /** Code required for password reset. */
    resetCode: string;
};

/** Handles the password reset process. */
export default function ResetForm({ resetCode }: ResetFormProps) {
    const { register, handleSubmit } = useForm({ defaultValues: { password: "" } });
    const resetPasswordMutation = useResetPasswordMutation();

    function onSubmit({ password }) {
        resetPasswordMutation.mutate({ password, resetCode });
    }

    const { error, isError } = resetPasswordMutation;

    return (
        <>
            <WallTitle title="Password Reset" subtitle="You must set a new password before proceeding." />
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
                <Button type="submit" color="blue">
                    Reset
                </Button>
            </form>
        </>
    );
}
