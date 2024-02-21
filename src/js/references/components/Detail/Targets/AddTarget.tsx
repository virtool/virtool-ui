import { DialogPortal } from "@radix-ui/react-dialog";
import { toNumber } from "lodash-es";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { useUpdateReference } from "../../../hooks";
import { ReferenceTarget } from "../../../types";
import { TargetForm } from "./TargetForm";

type AddTargetProps = {
    refId: string;
    /** A list of targets associated with the reference */
    targets: ReferenceTarget[];
    /** Indicates whether the dialog for adding a target is visible */
    show: boolean;
    /** A callback function to hide the dialog */
    onHide: () => void;
};

/**
 * Displays a dialog for adding a target
 */
export default function AddTarget({ refId, targets, show, onHide }: AddTargetProps) {
    const { mutation } = useUpdateReference(refId);
    const { reset } = mutation;

    function onSubmit({ description, name, length, required }) {
        const updatedTargets = [
            ...targets,
            {
                name,
                description,
                length: toNumber(length),
                required: required,
            },
        ];

        mutation.mutate(
            { targets: updatedTargets },
            {
                onSuccess: () => {
                    onHide();
                },
            },
        );
    }

    function onOpenChange() {
        onHide();
        reset();
    }

    return (
        <Dialog open={show} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Add Target</DialogTitle>
                    <TargetForm onSubmit={onSubmit} error={mutation.isError && mutation.error.response.body[0].msg} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
