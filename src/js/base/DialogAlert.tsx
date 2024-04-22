import styled from "styled-components";
import { Alert } from "./Alert";

export const DialogAlert = styled(Alert)`
    border-left: none;
    border-right: none;
    border-radius: 0;
    display: flex;
    margin-bottom: 0;

    i {
        line-height: 20px;
    }

    p {
        margin-left: 5px;
    }
`;

DialogAlert.displayName = "DialogAlert";
