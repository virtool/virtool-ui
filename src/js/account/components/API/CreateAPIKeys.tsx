import { mapValues } from "lodash-es";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { getFontSize } from "@app/theme";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogOverlay,
    DialogTitle,
    Icon,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIcon,
    InputLabel,
    SaveButton,
} from "@base";
import { DialogPortal } from "@radix-ui/react-dialog";
import { Field, Form, Formik } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { createAPIKey } from "../../actions";
import CreateAPIKeyInfo from "./CreateInfo";
import APIPermissions from "./Permissions";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the key"),
});

const getInitialFormValues = permissions => ({
    name: "",
    permissions: mapValues(permissions, () => false),
});

const CreateAPIKeyCopied = styled.p`
    color: ${props => props.theme.color.blue};
`;

const CreateAPIKeyInput = styled(Input)`
    text-align: center;
`;

const CreateAPIKeyInputContainer = styled(InputContainer)`
    margin-top: 15px;
    margin-bottom: 10px;
`;

const StyledCreateAPIKey = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    strong {
        color: ${props => props.theme.color.greenDark};
        font-size: ${getFontSize("lg")};
        margin-bottom: 5px;
    }
`;

function CreateAPIKey({ newKey, permissions, onCreate }) {
    const history = useHistory();
    const location = useLocation<{ createAPIKey: boolean }>();
    const [copied, setCopied] = useState(false);
    const [showCreated, setShowCreated] = useState(false);

    useEffect(() => {
        if (!showCreated && newKey) {
            setShowCreated(true);
        }
    }, [newKey]);

    function handleHide() {
        setCopied(false);
        setShowCreated(false);
        history.push({ state: { createAPIKey: false } });
    }

    function handleSubmit({ name, permissions }) {
        onCreate(name, permissions);
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(newKey).then(() => setCopied(true));
    }

    return (
        <Dialog open={location.state?.createAPIKey} onOpenChange={handleHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Create API Key</DialogTitle>
                    {showCreated ? (
                        <StyledCreateAPIKey>
                            <strong>Here is your key.</strong>
                            <p>Make note of it now. For security purposes, it will not be shown again.</p>

                            <CreateAPIKeyInputContainer align="right">
                                <CreateAPIKeyInput value={newKey} readOnly />
                                {window.isSecureContext && (
                                    <InputIcon aria-label="copy" name="copy" onClick={copyToClipboard} />
                                )}
                            </CreateAPIKeyInputContainer>
                            {copied && (
                                <CreateAPIKeyCopied>
                                    <Icon name="check" /> Copied
                                </CreateAPIKeyCopied>
                            )}
                        </StyledCreateAPIKey>
                    ) : (
                        <Formik
                            onSubmit={handleSubmit}
                            initialValues={getInitialFormValues(permissions)}
                            validationSchema={validationSchema}
                        >
                            {({ errors, setFieldValue, touched, values }) => (
                                <Form>
                                    <CreateAPIKeyInfo />
                                    <InputGroup>
                                        <InputLabel htmlFor="name">Name</InputLabel>
                                        <Field name="name" id="name" as={Input} />
                                        <InputError>{touched.name && errors.name}</InputError>
                                    </InputGroup>

                                    <label>Permissions</label>

                                    <APIPermissions
                                        keyPermissions={values.permissions}
                                        onChange={(key, value) =>
                                            setFieldValue("permissions", { ...values.permissions, [key]: value })
                                        }
                                    />

                                    <DialogFooter>
                                        <SaveButton />
                                    </DialogFooter>
                                </Form>
                            )}
                        </Formik>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}

function mapStateToProps(state) {
    return {
        newKey: state.account.newKey,
        permissions: state.account.permissions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onCreate: (name, permissions) => {
            dispatch(createAPIKey(name, permissions));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAPIKey);
