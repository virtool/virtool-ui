import {
    Alert,
    DialogFooter,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    ProgressBarAffixed,
    SaveButton,
} from "@base";
import { UploadBar } from "@files/components/UploadBar";
import { useImportReference, useUploadReference } from "@references/queries";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { useNavigate } from "@utils/hooks";

const ImportReferenceUpload = styled.div`
    margin-bottom: 15px;
`;

export function ImportReference() {
    const navigate = useNavigate();

    const importMutation = useImportReference();
    const { uploadMutation, fileName, fileNameOnDisk, progress } = useUploadReference();

    const {
        control,
        formState: { errors },
        handleSubmit,
        register,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
            upload: "",
        },
    });

    function handleDrop(acceptedFiles: File[]) {
        uploadMutation.mutate(acceptedFiles[0]);
    }

    const uploadBarMessage = fileName || (progress === 0 ? "Drag file here to upload" : "Uploading...");

    return (
        <>
            <Alert>
                <strong>Create a reference from a file previously exported from another Virtool reference.</strong>
            </Alert>

            <Controller
                control={control}
                name="upload"
                rules={{ required: true }}
                render={({ field: { onChange } }) => (
                    <ImportReferenceUpload>
                        <ProgressBarAffixed color="green" now={progress} />
                        <UploadBar
                            message={uploadBarMessage}
                            onDrop={acceptedFiles => {
                                handleDrop(acceptedFiles);
                                onChange(acceptedFiles[0].name);
                            }}
                            multiple={false}
                        />

                        <InputError>
                            {errors.upload?.type === "required" && "A reference file must be uploaded"}
                        </InputError>
                    </ImportReferenceUpload>
                )}
            />

            <form
                onSubmit={handleSubmit(values => {
                    importMutation.mutate(
                        { ...values, importFrom: fileNameOnDisk },
                        { onSuccess: () => navigate("~/refs") },
                    );
                })}
            >
                <InputGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputSimple id="name" {...register("name", { required: true })} />
                    <InputError>{errors.name?.type && "A name is required."}</InputError>
                </InputGroup>
                <InputGroup>
                    <InputLabel htmlFor="description">Description</InputLabel>
                    <InputSimple as="textarea" id="description" {...register("description")} />
                </InputGroup>

                <DialogFooter>
                    <SaveButton disabled={progress !== 100 && progress !== 0} altText="Import" />
                </DialogFooter>
            </form>
        </>
    );
}
