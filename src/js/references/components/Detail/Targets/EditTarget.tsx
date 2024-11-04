import { DialogPortal } from "@radix-ui/react-dialog";
import { useUpdateReference } from "@references/queries";
import { map, toNumber } from "lodash-es";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { ReferenceTarget } from "../../../types";
import { TargetForm } from "./TargetForm";

type EditTargetProps = {
    /** Indicates whether the dialog for adding a target is visible */
    show: boolean;
    /** A callback function to hide the dialog */
    onHide: () => void;
    refId: string;
    /** A list of targets associated with the reference */
    targets: ReferenceTarget[];
    /** The target being edited */
    target: ReferenceTarget;
};

/**
 * Displays a dialog for editing a target
 */
export default function EditTarget({ show, onHide, refId, targets, target }: EditTargetProps) {
    const initialTargetName = target?.name;

    const { mutation } = useUpdateReference(refId);
    const { reset } = mutation;

    function onSubmit({ description, name, length, required }) {
        const updatedTargets = map(targets, target =>
            initialTargetName === target.name
                ? { ...target, name, description, length: toNumber(length), required }
                : target,
        );

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
                    <DialogTitle>Edit Target</DialogTitle>
                    <TargetForm
                        description={target?.description}
                        name={target?.name}
                        length={target?.length}
                        required={target?.required}
                        onSubmit={onSubmit}
                        error={mutation.isError && mutation.error.response.body[0].msg}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
