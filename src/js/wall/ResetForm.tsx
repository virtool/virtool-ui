import { get } from "lodash-es";
import React from "react";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { resetPassword } from "../account/actions";
import { InputError, InputGroup, InputLabel, InputSimple } from "../base";
import { WallButton } from "./Container";

export function ResetForm({ error, onReset, resetCode }) {
    const { register, handleSubmit } = useForm({ defaultValues: { password: "" } });

    return (
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
