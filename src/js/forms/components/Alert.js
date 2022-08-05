import React from "react";
import styled from "styled-components";
import { Alert, Icon } from "../../base";
import { getColor } from "../../app/theme";

const StyledAlert = styled(Alert)`
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
        <StyledAlert>
            <span>Resumed editing draft sample.</span>
            <Icon aria-label="undo restore" name="undo" color="grey" onClick={onUndoRestore} />
            <Icon aria-label="close" name="times" color="grey" onClick={onClose} />
        </StyledAlert>
    );
};
