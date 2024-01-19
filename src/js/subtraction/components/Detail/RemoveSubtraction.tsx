import React from "react";
import { RemoveModal } from "../../../base";
import { useRemoveSubtraction } from "../../querys";
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
 * Displays a modal for removing a subtraction
 */
export default function RemoveSubtraction({ subtraction, show, onHide }: RemoveSubtractionProps) {
    const mutation = useRemoveSubtraction();

    return (
        <RemoveModal
            name={subtraction.name}
            noun="Subtraction"
            show={show}
            onHide={onHide}
            onConfirm={() => mutation.mutate({ subtractionId: subtraction.id })}
        />
    );
}
