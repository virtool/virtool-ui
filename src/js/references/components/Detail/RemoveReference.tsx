import { RemoveBanner } from "@/base";
import { RemoveDialog } from "@base/RemoveDialog";
import { useDialogParam, useNavigate } from "@/hooks";
import React, { useCallback } from "react";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";
import { useRemoveReference } from "../../queries";

type RemoveReferenceProps = {
    /** The id of the reference to remove */
    id: string;
    /** The name of the reference */
    name: string;
};

/**
 * Displays a banner for removing a reference
 */
export default function RemoveReference({ id, name }: RemoveReferenceProps) {
    const { open: openRemoveReference, setOpen: setOpenRemoveReference } =
        useDialogParam("openRemoveReference");
    const navigate = useNavigate();

    const { hasPermission: canRemove } = useCheckReferenceRight(
        id,
        ReferenceRight.remove,
    );
    const mutation = useRemoveReference();

    const handleClick = useCallback(
        () =>
            mutation.mutate(
                { refId: id },
                {
                    onSuccess: () => {
                        navigate("/refs");
                    },
                },
            ),
        ["id"],
    );

    return (
        canRemove && (
            <>
                <RemoveBanner
                    message="Permanently delete this reference"
                    buttonText="Delete"
                    onClick={() => setOpenRemoveReference(true)}
                />
                <RemoveDialog
                    name={name}
                    noun="Reference"
                    show={openRemoveReference}
                    onConfirm={handleClick}
                    onHide={() => setOpenRemoveReference(false)}
                />
            </>
        )
    );
}
