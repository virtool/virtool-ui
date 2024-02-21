import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { RemoveBanner } from "../../../base";
import { RemoveDialog } from "../../../base/RemoveDialog";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";
import { useRemoveReference } from "../../querys";

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
    const history = useHistory();
    const location = useLocation<{ removeRef: boolean }>();

    const { hasPermission: canRemove } = useCheckReferenceRight(id, ReferenceRight.remove);
    const mutation = useRemoveReference();

    const handleClick = useCallback(
        () =>
            mutation.mutate(
                { refId: id },
                {
                    onSuccess: () => {
                        history.push("/refs");
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
                    onClick={() => history.push({ state: { removeRef: true } })}
                />
                <RemoveDialog
                    name={name}
                    noun="Reference"
                    show={location.state?.removeRef}
                    onConfirm={handleClick}
                    onHide={() => history.push({ state: { removeRef: false } })}
                />
            </>
        )
    );
}
