import { DialogPortal } from "@radix-ui/react-dialog";
import { map, toNumber } from "lodash-es";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "../../../../base";
import { useUpdateReference } from "../../../hooks";
import { TargetForm } from "./TargetForm";

/**
 * Displays a dialog for editing a target
 */
export default function EditTarget({ show, onHide, refId, targets, target }) {
    const { description, name, length, required } = target;
    const { mutation } = useUpdateReference(refId);
    const { reset } = mutation;

    function onSubmit({ description, name, length, required }) {
        const updatedTargets = map(targets, target => {
            if (name === target.name) {
                return {
                    ...target,
                    name,
                    description,
                    length: toNumber(length),
                    required,
                };
            }

            return target;
        });

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
                    <DialogTitle>Add target</DialogTitle>
                    <TargetForm
                        description={description}
                        name={name}
                        length={length}
                        required={required}
                        onSubmit={onSubmit}
                        error={mutation.isError && mutation.error.response.body[0].msg}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
