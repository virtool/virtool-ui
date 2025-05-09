import { useDialogParam, useNavigate } from "@app/hooks";
import RemoveBanner from "@base/RemoveBanner";
import RemoveDialog from "@base/RemoveDialog";
import { ReferenceRight, useCheckReferenceRight } from "@references/hooks";
import { useRemoveReference } from "@references/queries";
import React, { useCallback } from "react";

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
