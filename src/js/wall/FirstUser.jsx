import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { getInitialState } from "../app/actions";
import { Input, InputError, InputGroup, InputLabel, InputPassword } from "../base";
import { createFirst } from "../users/api";
import { WallButton, WallContainer, WallDialog, WallHeader, WallLoginContainer, WallSubheader } from "./Container";
import { WallTitle } from "./WallTitle";

const initialValues = {
    username: "",
    password: "",
};

export default function FirstUser() {
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const mutation = useMutation(createFirst, {
        onSuccess: () => {
            // alert("success");
            dispatch(getInitialState());
        },
        onError: error => {
            setError(error.response.body.message);
        },
    });
    // alert(JSON.stringify(mutation.error.response.text));
    // alert(JSON.stringify(mutation));

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
                            <InputError>{error}</InputError>
                        </Form>
                    </Formik>
                </WallLoginContainer>
            </WallDialog>
        </WallContainer>
    );
}
