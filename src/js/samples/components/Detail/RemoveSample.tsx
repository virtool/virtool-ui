import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { RemoveDialog } from "../../../base/RemoveDialog";
import { useRemoveSample } from "../../querys";

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
    const history = useHistory();
    const location = useLocation<{ removeSample: boolean }>();
    const mutation = useRemoveSample();

    return (
        <RemoveDialog
            noun="Sample"
            name={name}
            show={location.state?.removeSample}
            onConfirm={() =>
                mutation.mutate(
                    { sampleId: id },
                    {
                        onSuccess: () => {
                            history.push("/samples");
                        },
                    },
                )
            }
            onHide={() => history.replace({ state: { removeSample: false } })}
        />
    );
}
