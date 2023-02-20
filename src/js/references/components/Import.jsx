import { Form, Formik } from "formik";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as Yup from "yup";
import { Alert, Box, InputError, ProgressBarAffixed, SaveButton, UploadBar } from "../../base";
import { upload } from "../../files/actions";
import { createRandomString } from "../../utils/utils";
import { importReference } from "../actions";
import { getImportData } from "../selectors";
import { ReferenceForm } from "./Form";

const getInitialState = () => ({
    name: "",
    description: "",
    localId: "",
    mode: "import"
});

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required Field"),
    localId: Yup.string().required("A reference file must be uploaded")
});

const ImportReferenceUploadContainer = styled(Box)`
    border-radius: ${props => props.theme.borderRadius.sm};
    padding: 15px 15px 0;
`;

export const ImportReference = ({ file, onDrop, onSubmit }) => {
    const handleDrop = (setFieldValue, setFieldError) => file => {
        if (file.length > 1) {
            return setFieldError("localId", "Only one file can be uploaded at a time");
        }
        const localId = createRandomString();
        setFieldValue("localId", localId);
        onDrop(localId, file[0], "reference");
    };

    const handleSubmit = ({ name, description }) => {
        onSubmit(name, description, `${file.id}-${file.name}`);
    };

    let message;
    let progress = 0;

    if (file) {
        progress = file.progress;
        message = file.ready ? `${file.name}` : "Uploading...";
    }

    return (
        <Formik initialValues={getInitialState()} onSubmit={handleSubmit} validationSchema={validationSchema}>
            {({ setFieldValue, touched, errors, setFieldError }) => (
                <Form>
                    <Alert>
                        <strong>
                            Create a reference from a file previously exported from another Virtool reference.
                        </strong>
                    </Alert>
                    <ImportReferenceUploadContainer>
                        <ProgressBarAffixed color={progress === 100 ? "green" : "orange"} now={progress} />
                        <UploadBar message={message} onDrop={handleDrop(setFieldValue, setFieldError)} />
                    </ImportReferenceUploadContainer>

                    <InputError>{errors.localId}</InputError>

                    <ReferenceForm errors={errors} touched={touched} mode="import" />

                    <SaveButton disabled={progress !== 100 && progress !== 0} altText="Import" />
                </Form>
            )}
        </Formik>
    );
};

export const mapStateToProps = state => ({
    file: getImportData(state)
});

export const mapDispatchToProps = dispatch => ({
    onSubmit: (name, description, dataType, organism, fileId) => {
        dispatch(importReference(name, description, dataType, organism, fileId));
    },

    onDrop: (localId, file, fileType) => {
        dispatch(upload(localId, file, fileType));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportReference);
