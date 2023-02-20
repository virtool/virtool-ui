import { ListboxButton as ReachListboxButton } from "@reach/listbox";
import "@reach/listbox/styles.css";
import styled from "styled-components/macro";
import { borderRadius } from "../app/theme";

const focusShadow = "0 0 0 2px rgba(43, 108, 176, 0.5)";

export const ListboxButton = styled(ReachListboxButton)`
    border: 1px solid ${props => props.theme.color.greyDark};
    border-radius: ${borderRadius.sm};
    box-shadow: ${props => props.theme.boxShadow.input};
    cursor: pointer;
    outline: none;
    padding: 8px 10px;
    position: relative;
    width: 100%;

    :focus {
        border-color: ${props => props.theme.color.blue};
        box-shadow: ${focusShadow};
    }
`;
