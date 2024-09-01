import { RemoveBanner } from "@base";
import { RemoveDialog } from "@base/RemoveDialog";
import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom-v5-compat";
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
    const navigate = useNavigate();
    const location = useLocation();

    const { hasPermission: canRemove } = useCheckReferenceRight(id, ReferenceRight.remove);
    const mutation = useRemoveReference();

    const handleClick = useCallback(
        () =>
            mutation.mutate(
                { refId: id },
                {
                    onSuccess: () => {
                        navigate("/refs");
                    },
                }
            ),
        ["id"]
    );

    return (
        canRemove && (
            <>
                <RemoveBanner
                    message="Permanently delete this reference"
                    buttonText="Delete"
                    onClick={() => navigate(".", { state: { removeRef: true } })}
                />
                <RemoveDialog
                    name={name}
                    noun="Reference"
                    show={location.state?.removeRef}
                    onConfirm={handleClick}
                    onHide={() => navigate(".", { replace: true, state: { removeRef: false } })}
                />
            </>
        )
    );
}
