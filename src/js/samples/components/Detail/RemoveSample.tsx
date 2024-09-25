import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { RemoveDialog } from "../../../base/RemoveDialog";
import { useRemoveSample } from "../../queries";

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
    const [openRemoveSample, setOpenRemoveSample] = useUrlSearchParams("openRemoveSample");
    const mutation = useRemoveSample();

    return (
        <RemoveDialog
            noun="Sample"
            name={name}
            show={Boolean(openRemoveSample)}
            onConfirm={() =>
                mutation.mutate(
                    { sampleId: id },
                    {
                        onSuccess: () => {
                            setOpenRemoveSample("");
                        },
                    }
                )
            }
            onHide={() => setOpenRemoveSample("")}
        />
    );
}
