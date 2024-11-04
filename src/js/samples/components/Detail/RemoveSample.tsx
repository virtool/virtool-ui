import React from "react";
import { RemoveDialog } from "../../../base/RemoveDialog";
import { useRemoveSample } from "../../queries";
import { useDialogParam } from "@utils/hooks";

type RemoveSampleProps = {
    /** The id of the sample being removed */
    id: string;
    /** The name of the sample being removed */
    name: string;
};

/**
 * Displays a dialog for removing a sample
 */
export default function RemoveSample({ id, name }: RemoveSampleProps) {
    const { open: openRemoveSample, setOpen: setOpenRemoveSample } = useDialogParam("openRemoveSample");
    const mutation = useRemoveSample();

    return (
        <RemoveDialog
            noun="Sample"
            name={name}
            show={openRemoveSample}
            onConfirm={() =>
                mutation.mutate(
                    { sampleId: id },
                    {
                        onSuccess: () => {
                            setOpenRemoveSample(false);
                        },
                    },
                )
            }
            onHide={() => setOpenRemoveSample(false)}
        />
    );
}
