import { Request } from "@app/request";
import {
    Alert,
    DialogFooter,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    ProgressBarAffixed,
    SaveButton,
    UploadBar,
} from "@base";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const ImportReferenceUpload = styled.div`
    margin-bottom: 15px;
`;

interface ImportReferenceValues {
    name: string;
    description: string;
    importFrom: string;
}

/**
 * Make the API call to import a reference.
 * @param name - name of the reference
 * @param description - description for the reference
 * @param importFrom - the ID of the file to import from
 */
function importReference({ name, description, importFrom }: ImportReferenceValues) {
    return Request.post("/refs").send({
        name,
        description,
        import_from: importFrom,
    });
}

export function ImportReference() {
    const [fileName, setFileName] = useState("");
    const [fileNameOnDisk, setFileNameOnDisk] = useState("");
    const [progress, setProgress] = useState(0);

    const history = useHistory();

    const importMutation = useMutation(importReference, { onSuccess: () => history.push("/refs") });

    const uploadMutation = useMutation((file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return Request.post("/uploads")
            .query({ name: file.name, type: "reference" })
            .send(formData)
            .on("progress", event => {
                setProgress(event.percent);
            })
            .then(response => {
                setFileName(response.body.name);
                setFileNameOnDisk(response.body.name_on_disk);
            });
    });

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
                    importMutation.mutate({ ...values, importFrom: fileNameOnDisk });
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
