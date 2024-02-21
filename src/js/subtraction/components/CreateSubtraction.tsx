import { Field, Form, Formik, FormikErrors, FormikTouched } from "formik";
import React from "react";
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
import { useCreateSubtraction } from "../querys";
import { SubtractionFileSelector } from "./SubtractionFileSelector";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("A name is required"),
    uploadId: Yup.array().min(1, "Please select a file"),
});

type formValues = {
    name: "";
    nickname: "";
    uploadId: string[];
};

const initialValues = {
    name: "",
    nickname: "",
    uploadId: [],
};

/**
 * A form for creating a subtraction
 */
export default function CreateSubtraction() {
    const history = useHistory();
    const {
        data: files,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteFindFiles(FileType.subtraction, 25);
    const subtractionMutation = useCreateSubtraction();

    if (isLoading) {
        return <LoadingPlaceholder margin="36px" />;
    }

    function handleSubmit({ uploadId, name, nickname }) {
        subtractionMutation.mutate(
            { name, nickname, uploadId: uploadId[0] },
            {
                onSuccess: () => {
                    history.push("/subtractions");
                },
            },
        );
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
                        <PersistForm formName="create-subtraction" />
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
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isLoading={isLoading}
                            foundCount={files.pages[0].found_count}
                            selected={values.uploadId}
                        />
                        <SaveButton />
                    </Form>
                )}
            </Formik>
        </>
    );
}
