import { mapValues } from "lodash-es";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../../app/actions";

import {
    ModalBody,
    ModalFooter,
    Icon,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIcon,
    InputLabel,
    Modal,
    SaveButton,
    ModalHeader
} from "../../../base";
import { routerLocationHasState } from "../../../utils/utils";
import { clearAPIKey, createAPIKey } from "../../actions";
import CreateAPIKeyInfo from "./CreateInfo";
import APIPermissions from "./Permissions";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const CreateAPIKeyCopied = styled.p`
    color: ${props => props.theme.color.blue};
`;

const CreateAPIKeyInput = styled(Input)`
    text-align: center;
`;

const StyledCreateAPIKey = styled(ModalBody)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;

    strong {
        color: ${props => props.theme.color.greenDark};
        margin-bottom: 5px;
    }
`;

const APIKeyInputContainer = styled(InputContainer)`
    margin-top: 15px;
    margin-bottom: 10px;
`;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Provide a name for the key")
});

export const getInitialFormValues = props => ({
    name: "",
    permissions: mapValues(props.permissions, () => false)
});

export const CreateAPIKey = props => {
    const [copied, setCopied] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!show && props.newKey) {
            setShow(true);
        }
    }, [props.newKey]);

    const handleModalExited = () => {
        setCopied(false);
        setShow(false);
    };

    const handleSubmit = ({ name, permissions }) => {
        props.onCreate(name, permissions);
    };

    let content;

    if (show) {
        content = (
            <StyledCreateAPIKey>
                <strong>Here is your key.</strong>
                <small>Make note of it now. For security purposes, it will not be shown again.</small>

                <APIKeyInputContainer align="right">
                    <CreateAPIKeyInput value={props.newKey} readOnly />
                    <CopyToClipboard text={props.newKey} onCopy={() => setCopied(true)}>
                        <InputIcon aria-label="copy" name="copy" />
                    </CopyToClipboard>
                </APIKeyInputContainer>
                {copied && (
                    <CreateAPIKeyCopied>
                        <Icon name="check" /> Copied
                    </CreateAPIKeyCopied>
                )}
            </StyledCreateAPIKey>
        );
    } else {
        content = (
            <>
                <ModalHeader>Create API Key</ModalHeader>
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={getInitialFormValues(props)}
                    validationSchema={validationSchema}
                >
                    {({ errors, setFieldValue, touched, values }) => (
                        <Form>
                            <CreateAPIKeyInfo />
                            <ModalBody>
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
                            </ModalBody>

                            <ModalFooter>
                                <SaveButton />
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </>
        );
    }

    return (
        <Modal label="Create API Key" show={props.show} onHide={props.onHide} onExited={handleModalExited}>
            {content}
        </Modal>
    );
};

export const mapStateToProps = state => {
    return {
        show: routerLocationHasState(state, "createAPIKey"),
        newKey: state.account.newKey,
        permissions: state.account.permissions
    };
};

export const mapDispatchToProps = dispatch => ({
    onCreate: (name, permissions) => {
        dispatch(createAPIKey(name, permissions));
    },

    onHide: () => {
        dispatch(pushState({ createAPIKey: false }));
        dispatch(clearAPIKey());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAPIKey);
