import { Field, Form, Formik } from "formik";
import { find } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
    Input,
    InputError,
    InputGroup,
    InputLabel,
    LoadingPlaceholder,
    SaveButton,
    ViewHeader,
    ViewHeaderTitle,
} from "../../base";
import { useListFiles } from "../../files/querys";
import { FileType } from "../../files/types";
import PersistForm from "../../forms/components/PersistForm";
import { createSubtraction } from "../actions";
import { SubtractionFileSelector } from "./FileSelector";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("A name is required"),
    uploadId: Yup.string().required("Please select a file"),
});

const castValues = files => values => {
    const uploadId = find(files, ["id", values.uploadId]) ? values.uploadId : "";
    return { ...values, uploadId };
};

export const CreateSubtraction = ({ onCreate }) => {
    const { data: filesResponse, isLoading } = useListFiles(FileType.subtraction, false, 1);

    if (isLoading) {
        return <LoadingPlaceholder margin="36px" />;
    }

    const files = filesResponse.documents;

    const initialValues = {
        name: "",
        nickname: "",
        uploadId: "",
    };

    const handleSubmit = ({ uploadId, name, nickname }) => {
        onCreate({ uploadId, name, nickname });
    };

    return (
        <>
            <ViewHeader title="Create Subtraction">
                <ViewHeaderTitle>Create Subtraction</ViewHeaderTitle>
            </ViewHeader>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, setFieldValue, touched }) => (
                    <Form>
                        <PersistForm formName="create-subtraction" castValues={castValues(files)} />
                        <InputGroup>
                            <InputLabel>Name</InputLabel>
                            <Field
                                aria-label={"name"}
                                as={Input}
                                name="name"
                                type="text"
                                error={touched.name ? errors.name : null}
                            />
                            {touched.name && <InputError>{errors.name}</InputError>}
                        </InputGroup>

                        <InputGroup>
                            <InputLabel>Nickname</InputLabel>
                            <Field aria-label={"nickname"} as={Input} name="nickname" type="text" />
                        </InputGroup>

                        <label>Files</label>
                        <Field
                            as={SubtractionFileSelector}
                            name="uploadId"
                            onClick={id => setFieldValue("uploadId", id)}
                            error={touched.uploadId && errors.uploadId}
                            files={files}
                        />
                        <SaveButton />
                    </Form>
                )}
            </Formik>
        </>
    );
};

const mapDispatchToProps = dispatch => ({
    onCreate: ({ uploadId, name, nickname }) => {
        dispatch(createSubtraction(uploadId, name, nickname));
    },
});

export default connect(null, mapDispatchToProps)(CreateSubtraction);
