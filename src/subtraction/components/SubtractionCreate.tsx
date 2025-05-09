import { useInfiniteFindFiles } from "@/uploads/queries";
import { UploadType } from "@/uploads/types";
import { DialogPortal } from "@radix-ui/react-dialog";
import React from "react";
import { Controller } from "react-hook-form";
import { useDialogParam } from "../../app/hooks";
import Dialog from "../../base/Dialog";
import DialogContent from "../../base/DialogContent";
import DialogDescription from "../../base/DialogDescription";
import DialogFooter from "../../base/DialogFooter";
import DialogOverlay from "../../base/DialogOverlay";
import DialogTitle from "../../base/DialogTitle";
import InputError from "../../base/InputError";
import InputGroup from "../../base/InputGroup";
import InputLabel from "../../base/InputLabel";
import InputSimple from "../../base/InputSimple";
import LoadingPlaceholder from "../../base/LoadingPlaceholder";
import PseudoLabel from "../../base/PseudoLabel";
import SaveButton from "../../base/SaveButton";
import { RestoredAlert } from "../../forms/components/RestoredAlert";
import { usePersistentForm } from "../../forms/hooks";
import { useCreateSubtraction } from "../queries";
import { SubtractionFileSelector } from "./SubtractionFileSelector";

type FormValues = {
    name: string;
    nickname: string;
    uploadId: string[];
};

/**
 * Displays a dialog for creating a subtraction
 */
export default function SubtractionCreate() {
    const { open, setOpen } = useDialogParam("openCreateSubtraction");

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
    } = useInfiniteFindFiles(UploadType.subtraction, 25);

    const mutation = useCreateSubtraction();

    function onSubmit({ name, nickname, uploadId }: FormValues) {
        mutation.mutate(
            { name, nickname, uploadId: uploadId[0] },
            {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent size="lg">
                    <DialogTitle>Create Subtraction</DialogTitle>
                    <DialogDescription>
                        Create a new subtraction from a FASTA file.
                    </DialogDescription>
                    {isPending ? (
                        <LoadingPlaceholder className="mt-9" />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <RestoredAlert
                                hasRestored={hasRestored}
                                name="subtraction"
                                resetForm={reset}
                            />
                            <InputGroup>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <InputSimple
                                    id="name"
                                    {...register("name", {
                                        required: "A name is required",
                                    })}
                                />
                                <InputError>{errors.name?.message}</InputError>
                            </InputGroup>

                            <InputGroup>
                                <InputLabel htmlFor="nickname">
                                    Nickname
                                </InputLabel>
                                <InputSimple
                                    id="nickname"
                                    {...register("nickname")}
                                />
                            </InputGroup>

                            <PseudoLabel>Files</PseudoLabel>
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
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
