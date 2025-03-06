import { RemoveDialog } from "@base/RemoveDialog";
import { useNavigate } from "@/hooks";
import React from "react";
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
export default function RemoveSubtraction({
    subtraction,
    show,
    onHide,
}: RemoveSubtractionProps) {
    const mutation = useRemoveSubtraction();
    const navigate = useNavigate();

    return (
        <RemoveDialog
            name={subtraction.name}
            noun="Subtraction"
            show={show}
            onHide={onHide}
            onConfirm={() =>
                mutation.mutate(
                    { subtractionId: subtraction.id },
                    {
                        onSuccess: () => {
                            navigate("/subtractions");
                        },
                    },
                )
            }
        />
    );
}
