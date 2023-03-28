import styled from "styled-components";
import { Badge } from "./Badge";

export const ViewHeaderTitle = styled.h1`
    align-items: center;
    display: flex;
    font-size: ${props => props.theme.fontSize.xxl};
    font-weight: bold;
    margin: 0;

    ${Badge} {
        font-size: ${props => props.theme.fontSize.md};
        margin-left: 7px;
        padding: 5px 7px;
    }
`;

ViewHeaderTitle.displayName = "ViewHeaderTitle";
