import {
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    LoadingPlaceholder,
    SaveButton,
    ViewHeader,
    ViewHeaderTitle,
} from "@base";
import { useInfiniteFindFiles } from "@files/queries";
import { FileType } from "@files/types";
import { SubtractionFileSelector } from "@subtraction/components/SubtractionFileSelector";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useCreateSubtraction } from "../queries";

type FormValues = {
    name: string;
    nickname: string;
    uploadId: string[];
};

/**
 * A form for creating a subtraction
 */
export default function CreateSubtraction() {
    const history = useHistory();
    const {
        formState: { errors },
        control,
        register,
        handleSubmit,
    } = useForm<FormValues>({ defaultValues: { name: "", nickname: "", uploadId: [] } });
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

    function onSubmit({ name, nickname, uploadId }: FormValues) {
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <InputSimple id="name" {...register("name", { required: "A name is required" })} />
                    <InputError>{errors.name?.message}</InputError>
                </InputGroup>

                <InputGroup>
                    <InputLabel htmlFor="nickname">Nickname</InputLabel>
                    <InputSimple id="nickname" {...register("nickname")} />
                </InputGroup>

                <label>Files</label>

                <Controller
                    name="uploadId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <SubtractionFileSelector
                            onClick={onChange}
                            error={errors.uploadId?.message}
                            files={files}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isLoading={isLoading}
                            foundCount={files.pages[0].found_count}
                            selected={value}
                        />
                    )}
                    rules={{ required: "Please select a file" }}
                />
                <SaveButton />
            </form>
        </>
    );
}
