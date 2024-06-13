import { getColor } from "@app/theme";
import { Alert, Icon } from "@base";
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
    hasRestored: boolean;
    name: string;
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
                <Icon aria-label="undo restore" name="undo" color="grey" onClick={onUndoRestore} />
                <Icon aria-label="close" name="times" color="grey" onClick={() => setDismissed(true)} />
            </StyledRestoredAlert>
        )
    );
}
