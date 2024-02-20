import React, { useCallback } from "react";
import { connect } from "react-redux";
import { RemoveBanner } from "../../../base";
import { removeReference } from "../../actions";
import { ReferenceRight, useCheckReferenceRight } from "../../hooks";

type RemoveReferenceProps = {
    /** The id of the reference to remove */
    id: string;
    onConfirm: any;
};

/**
 * Displays a banner for removing a reference
 */
export function RemoveReference({ id, onConfirm }: RemoveReferenceProps) {
    const { hasPermission: canRemove } = useCheckReferenceRight(id, ReferenceRight.remove);
    const handleClick = useCallback(() => onConfirm(id), ["id"]);

    return (
        canRemove && (
            <RemoveBanner message="Permanently delete this reference" buttonText="Delete" onClick={handleClick} />
        )
    );
}

export const mapDispatchToProps = dispatch => ({
    onConfirm: refId => {
        dispatch(removeReference(refId));
    },
});

export default connect(null, mapDispatchToProps)(RemoveReference);
