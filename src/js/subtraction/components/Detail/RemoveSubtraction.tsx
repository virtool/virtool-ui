import React from "react";
import { useHistory } from "react-router-dom";
import { RemoveModal } from "../../../base";
import { useRemoveSubtraction } from "../../queries";
import { Subtraction } from "../../types";

type RemoveSubtractionProps = {
    /** The subtraction data */
    subtraction: Subtraction;
    /** Indicates whether the modal for removing a subtraction is visible */
    show: boolean;
    /** A callback function to hide the modal */
    onHide: () => void;
};

/**
 * Dialog for removing an existing subtraction
 */
export default function RemoveSubtraction({ subtraction, show, onHide }: RemoveSubtractionProps) {
    const mutation = useRemoveSubtraction();
    const history = useHistory();

    return (
        <RemoveModal
            name={subtraction.name}
            noun="Subtraction"
            show={show}
            onHide={onHide}
            onConfirm={() =>
                mutation.mutate(
                    { subtractionId: subtraction.id },
                    {
                        onSuccess: () => {
                            history.push("/subtractions");
                        },
                    },
                )
            }
        />
    );
}
