import styled from "styled-components";
import { getBorder } from "../app/theme";

export const Tabs = styled.nav`
    border-bottom: ${getBorder};
    display: flex;
    margin-bottom: 15px;
    width: 100%;
`;

Tabs.displayName = "Tabs";
