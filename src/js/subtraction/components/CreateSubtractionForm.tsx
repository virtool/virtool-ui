import { DialogFooter, InputError, InputGroup, InputLabel, InputSimple, LoadingPlaceholder, SaveButton } from "@base";
import { useInfiniteFindFiles } from "@files/queries";
import { FileType } from "@files/types";
import { RestoredAlert } from "@forms/components/RestoredAlert";
import { usePersistentForm } from "@forms/hooks";
import { SubtractionFileSelector } from "@subtraction/components/SubtractionFileSelector";
import { useCreateSubtraction } from "@subtraction/queries";
import React from "react";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom-v5-compat";

type FormValues = {
    name: string;
    nickname: string;
    uploadId: string[];
};

/**
 * A form for creating a subtraction
 */
export function CreateSubtractionForm() {
    const navigate = useNavigate();
    const {
        hasRestored,
        formState: { errors },
        control,
        register,
        handleSubmit,
        reset,
    } = usePersistentForm<FormValues>({
        formName: "createSubtraction",
        defaultValues: { name: "", nickname: "", uploadId: [] },
    });
    const {
        data: files,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteFindFiles(FileType.subtraction, 25);
    const mutation = useCreateSubtraction();

    if (isPending) {
        return <LoadingPlaceholder className="mt-9" />;
    }

    function onSubmit({ name, nickname, uploadId }: FormValues) {
        mutation.mutate(
            { name, nickname, uploadId: uploadId[0] },
            {
                onSuccess: () => {
                    navigate(".", { state: { createSubtraction: false } });
                    reset();
                },
            }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <RestoredAlert hasRestored={hasRestored} name="subtraction" resetForm={reset} />
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
                        isPending={isPending}
                        foundCount={files.pages[0].found_count}
                        selected={value}
                    />
                )}
                rules={{ required: "Please select a file" }}
            />
            <DialogFooter>
                <SaveButton />
            </DialogFooter>
        </form>
    );
}
