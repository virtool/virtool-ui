import React from "react";
import styled from "styled-components";
import { getColor } from "../../app/theme";
import { Alert, Icon } from "../../base";

const StyledRestoredAlert = styled(Alert)`
    display: flex;
    align-items: center;

    button {
        margin-left: 10px;
        color: ${props => getColor({ color: "greyDark", theme: props.theme })};

        :hover {
            color: ${props => getColor({ color: "greyDarkest", theme: props.theme })};
        }
        :last-child {
            margin-left: auto;
            font-size: 16px;
        }
    }
`;

export const RestoredAlert = ({ onClose, resetForm }) => {
    const onUndoRestore = () => {
        resetForm();
        onClose();
    };

    return (
        <StyledRestoredAlert>
            <span>Resumed editing draft sample.</span>
            <Icon aria-label="undo restore" name="undo" color="grey" onClick={onUndoRestore} />
            <Icon aria-label="close" name="times" color="grey" onClick={onClose} />
        </StyledRestoredAlert>
    );
};
