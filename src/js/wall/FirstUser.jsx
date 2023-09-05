import { Field, Form, Formik } from "formik";
import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { Input, InputError, InputGroup, InputLabel, InputPassword } from "../base";
import { createFirstUser } from "../users/actions";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

const initialValues = {
    username: "",
    password: "",
};

export const FirstUser = ({ onSubmit, errors }) => {
    const handleSubmit = values => {
        onSubmit(values.username, values.password);
    };

    return (
        <WallContainer>
            <WallDialog>
                <WallLoginContainer>
                    <WallTitle />
                    <WallHeader>Setup First User</WallHeader>
                    <WallSubheader>
                        Create an administrative user that can be used to configure your new Virtool instance.
                    </WallSubheader>

                    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                        <Form>
                            <InputGroup>
                                <InputLabel>Username</InputLabel>
                                <Field type="text" name="username" as={Input} autoFocus />
                                {errors.usernameErrors.map(error => (
                                    <InputError key={error}>{error}</InputError>
                                ))}
                            </InputGroup>
                            <InputGroup>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Field id="password" name="password" as={InputPassword} />
                                {errors.passwordErrors.map(error => (
                                    <InputError key={error}>{error}</InputError>
                                ))}
                            </InputGroup>

                            <WallButton type="submit" icon="user-plus" color="blue">
                                Create User
                            </WallButton>
                            <InputError>{errors.generalError}</InputError>
                        </Form>
                    </Formik>
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
};

export const mapDispatchToProps = dispatch => ({
    onSubmit: (username, password) => {
        dispatch(createFirstUser(username, password));
    },
});

export const mapStateToProps = state => ({
    errors: {
        generalError: get(state, "errors.CREATE_FIRST_USER_ERROR.message", ""),
        usernameErrors: get(state, "errors.CREATE_FIRST_USER_ERROR.errors.user_id", [""]),
        passwordErrors: get(state, "errors.CREATE_FIRST_USER_ERROR.errors.password", [""]),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(FirstUser);
