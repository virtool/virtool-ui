import { mapValues } from "lodash-es";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect } from "react-redux";
import styled from "styled-components";
import { pushState } from "../../../app/actions";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { getFontSize } from "../../../app/theme";
import {
    Icon,
    Input,
    InputContainer,
    InputError,
    InputGroup,
    InputIcon,
    InputLabel,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    SaveButton,
} from "../../../base";
import { routerLocationHasState } from "../../../utils/utils";
import { clearAPIKey, createAPIKey } from "../../actions";
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

const StyledCreateAPIKey = styled(ModalBody)`
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

function CreateAPIKey({ newKey, permissions, show, onCreate, onHide }) {
    const [copied, setCopied] = useState(false);
    const [showCreated, setShowCreated] = useState(false);

    useEffect(() => {
        if (!showCreated && newKey) {
            setShowCreated(true);
        }
    }, [newKey]);

    const handleModalExited = () => {
        setCopied(false);
        setShowCreated(false);
    };

    const handleSubmit = ({ name, permissions }) => {
        onCreate(name, permissions);
    };

    return (
        <Modal label="Create API Key" show={show} onHide={onHide} onExited={handleModalExited}>
            <ModalHeader>Create API Key</ModalHeader>
            {showCreated ? (
                <StyledCreateAPIKey>
                    <strong>Here is your key.</strong>
                    <p>Make note of it now. For security purposes, it will not be shown again.</p>

                    <CreateAPIKeyInputContainer align="right">
                        <CreateAPIKeyInput value={newKey} readOnly />
                        <CopyToClipboard text={newKey} onCopy={() => setCopied(true)}>
                            <InputIcon aria-label="copy" name="copy" />
                        </CopyToClipboard>
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
            )}
        </Modal>
    );
}

function mapStateToProps(state) {
    return {
        show: routerLocationHasState(state, "createAPIKey"),
        newKey: state.account.newKey,
        permissions: state.account.permissions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onCreate: (name, permissions) => {
            dispatch(createAPIKey(name, permissions));
        },

        onHide: () => {
            dispatch(pushState({ createAPIKey: false }));
            dispatch(clearAPIKey());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAPIKey);
