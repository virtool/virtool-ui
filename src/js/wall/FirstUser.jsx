import { Field, Form, Formik } from "formik";
import React from "react";
import { useMutation } from "react-query";
import { Input, InputError, InputGroup, InputLabel, InputPassword } from "../base";
import { createFirst } from "../users/api";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

const initialValues = {
    username: "",
    password: "",
};

/**
 * A form for creating the first instance user.
 */
export default function FirstUser() {
    const mutation = useMutation(createFirst, {
        onSuccess: () => {
            window.location.reload();
        },
    });

    const handleSubmit = values => {
        mutation.mutate({
            handle: values.username,
            password: values.password,
        });
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
                            </InputGroup>
                            <InputGroup>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Field id="password" name="password" as={InputPassword} />
                            </InputGroup>

                            <WallButton type="submit" icon="user-plus" color="blue">
                                Create User
                            </WallButton>
                            {mutation.isError ? <InputError>{mutation.error.response?.body.message}</InputError> : null}
                        </Form>
                    </Formik>
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}
