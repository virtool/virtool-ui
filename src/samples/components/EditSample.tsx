import { useDialogParam } from "@app/hooks";
import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import InputError from "@base/InputError";
import InputGroup from "@base/InputGroup";
import InputLabel from "@base/InputLabel";
import InputSimple from "@base/InputSimple";
import SaveButton from "@base/SaveButton";
import TextArea from "@base/TextArea";
import { pick } from "es-toolkit/object";
import { useForm } from "react-hook-form";
import { useUpdateSample } from "../queries";
import { Sample } from "../types";

type EditSampleProps = {
    /** The sample data */
    sample: Sample;
};

/**
 * Displays a dialog for editing the sample
 */
export default function EditSample({ sample }: EditSampleProps) {
    const { open: openEditSample, setOpen: setOpenEditSample } =
        useDialogParam("openEditSample");
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
        <Dialog
            open={openEditSample}
            onOpenChange={() => setOpenEditSample(false)}
        >
            <DialogContent>
                <DialogTitle>Edit Sample</DialogTitle>
                <form
                    onSubmit={handleSubmit((values) =>
                        mutation.mutate(
                            {
                                update: pick(values, [
                                    "name",
                                    "isolate",
                                    "host",
                                    "locale",
                                    "notes",
                                ]),
                            },
                            {
                                onSuccess: () => {
                                    setOpenEditSample(false);
                                },
                            },
                        ),
                    )}
                >
                    <InputGroup>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <InputSimple id="name" {...register("name")} />
                        <InputError>
                            {mutation.isError &&
                                (mutation.error.response.body.message ||
                                    "Required Field")}
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
        </Dialog>
    );
}
