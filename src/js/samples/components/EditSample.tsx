import { DialogPortal } from "@radix-ui/react-dialog";
import { pick } from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
    InputError,
    InputGroup,
    InputLabel,
    InputSimple,
    SaveButton,
    TextArea,
} from "../../base";
import { useUpdateSample } from "../queries";
import { Sample } from "../types";

type EditSampleProps = {
    /** The sample data */
    sample: Sample;
    /** Indicates whether the modal for editing a sample is visible */
    show: boolean;
    /** A callback function to hide the modal */
    onHide: () => void;
};

/**
 * Displays a dialog for editing the sample
 */
export default function EditSample({ sample, show, onHide }: EditSampleProps) {
    const history = useHistory();
    const mutation = useUpdateSample(sample.id);

    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: sample.name ?? "",
            isolate: sample.isolate ?? "",
            host: sample.host ?? "",
            locale: sample.locale ?? "",
            notes: sample.notes ?? "",
        },
    });

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Edit Sample</DialogTitle>
                    <form
                        onSubmit={handleSubmit(values =>
                            mutation.mutate(
                                {
                                    update: pick(values, ["name", "isolate", "host", "locale", "notes"]),
                                },
                                {
                                    onSuccess: () => {
                                        history.replace({
                                            state: { editSample: false },
                                        });
                                    },
                                }
                            )
                        )}
                    >
                        <InputGroup>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <InputSimple id="name" {...register("name")} />
                            <InputError>
                                {mutation.isError && (mutation.error.response.body.message || "Required Field")}
                            </InputError>
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="isolate">Isolate</InputLabel>
                            <InputSimple id="isolate" {...register("isolate")} />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="host">Host</InputLabel>
                            <InputSimple id="host" {...register("host")} />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="locale">Locale</InputLabel>
                            <InputSimple id="locale" {...register("locale")} />
                        </InputGroup>
                        <InputGroup>
                            <InputLabel htmlFor="notes">Notes</InputLabel>
                            <TextArea id="notes" {...register("notes")} />
                        </InputGroup>

                        <SaveButton />
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
