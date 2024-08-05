import { getColor } from "@app/theme";
import { Alert } from "@base";
import { IconButton } from "@base/IconButton";
import React, { useState } from "react";
import styled from "styled-components";

const StyledRestoredAlert = styled(Alert)`
    display: flex;
    align-items: center;

    button {
        margin-left: 10px;
        color: ${props => getColor({ color: "greyDark", theme: props.theme })};

        &:hover {
            color: ${props => getColor({ color: "greyDarkest", theme: props.theme })};
        }
        &:last-child {
            margin-left: auto;
            font-size: 16px;
        }
    }
`;

export type RestoredAlertProps = {
    /* Whether the form has been restored from cached values */
    hasRestored: boolean;
    /* the display name of the resource */
    name: string;
    /* undo the restoration and restore the form to its initial state */
    resetForm: () => void;
};

/** Alert informing users of form data restoration */
export function RestoredAlert({ hasRestored, name, resetForm }: RestoredAlertProps) {
    const [dismissed, setDismissed] = useState(false);

    function onUndoRestore() {
        resetForm();
        setDismissed(true);
    }

    const show = hasRestored && !dismissed;

    return (
        show && (
            <StyledRestoredAlert>
                <span>Resumed editing draft {name}.</span>
                <IconButton name="undo" color="gray" tip="Undo Restore" onClick={onUndoRestore} />
                <IconButton name="times" color="gray" tip="Close" onClick={() => setDismissed(true)} />
            </StyledRestoredAlert>
        )
    );
}
