import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { RemoveBanner } from "../../../base";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";
import { useRemoveReference } from "../../querys";

type RemoveReferenceProps = {
    /** The id of the reference to remove */
    id: string;
};

/**
 * Displays a banner for removing a reference
 */
export default function RemoveReference({ id }: RemoveReferenceProps) {
    const history = useHistory();
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
            <RemoveBanner message="Permanently delete this reference" buttonText="Delete" onClick={handleClick} />
        )
    );
}
