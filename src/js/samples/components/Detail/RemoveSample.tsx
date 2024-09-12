import React from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const navigate = useNavigate();
    const location = useLocation();
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
                            navigate("/samples");
                        },
                    },
                )
            }
            onHide={() => navigate(".", { replace: true, state: { removeSample: false } })}
        />
    );
}
