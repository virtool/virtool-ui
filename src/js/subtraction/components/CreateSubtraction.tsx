import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import { find } from "lodash-es";
import React from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
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
import { useInfiniteFindFiles } from "../../files/querys";
import { FileType } from "../../files/types";
import PersistForm from "../../forms/components/PersistForm";
import { create } from "../api";
import { SubtractionFileSelector } from "./SubtractionFileSelector";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("A name is required"),
    uploadId: Yup.string().required("Please select a file"),
});

function castValues(files) {
    files.forEach(item => {
        return function (values) {
            const uploadId = find(item, ["id", values.uploadId]) ? values.uploadId : "";
            return { ...values, uploadId };
        };
    });
}

type formValues = {
    name: "";
    nickname: "";
    uploadId: "";
};

/**
 * A form for creating a subtraction
 */
export default function CreateSubtraction() {
    const {
        data: filesResponse,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteFindFiles(FileType.subtraction, 25);

    const history = useHistory();
    const subtractionMutation = useMutation(create, {
        onSuccess: () => {
            history.push("/subtractions");
        },
    });

    if (isLoading) {
        return <LoadingPlaceholder margin="36px" />;
    }

    function onCreate(uploadId, name, nickname) {
        subtractionMutation.mutate({ name, nickname, uploadId });
    }

    const files = filesResponse.pages;

    const initialValues = {
        name: "",
        nickname: "",
        uploadId: "",
    };

    function handleSubmit({ uploadId, name, nickname }) {
        onCreate(uploadId, name, nickname);
    }

    return (
        <>
            <ViewHeader title="Create Subtraction">
                <ViewHeaderTitle>Create Subtraction</ViewHeaderTitle>
            </ViewHeader>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({
                    errors,
                    setFieldValue,
                    touched,
                    values,
                }: {
                    errors: FormikErrors<formValues>;
                    setFieldValue: (field: string, value: string) => void;
                    touched: FormikTouched<formValues>;
                    values: formValues;
                }) => (
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
                            files={filesResponse}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            isLoading={isLoading}
                            foundCount={filesResponse.pages[0].found_count}
                            selected={values.uploadId}
                        />
                        <SaveButton />
                    </Form>
                )}
            </Formik>
        </>
    );
}
