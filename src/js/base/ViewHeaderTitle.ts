import styled from "styled-components";

export const ViewHeaderTitle = styled.h1`
    align-items: center;
    display: flex;
    font-size: ${props => props.theme.fontSize.xxl};
    font-weight: bold;
    margin: 0;
`;

ViewHeaderTitle.displayName = "ViewHeaderTitle";
