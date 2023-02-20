import styled from "styled-components/macro";
import { getBorder } from "../app/theme";
import { BoxGroupSection } from "./BoxGroupSection";
import { ModalAlert } from "./ModalAlert";

export const ModalBody = styled(BoxGroupSection)`
    border-top: ${getBorder};

    & ~ & {
        border-top: none;
    }

    ${ModalAlert} ~ & {
        border-top: none;
    }
`;
