import styled from "styled-components";

export const InputSimple = styled.input`
    background-color: ${props => props.theme.color.white};
    border: 1px solid ${props => props.theme.color.greyLight};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    display: block;
    font-size: ${props => props.theme.fontSize.md};
    height: auto;
    outline: none;
    padding: 8px 10px;
    position: relative;
    transition: border-color ease-in-out 150ms, box-shadow ease-in-out 150ms;
    width: 100%;

    :focus {
        border-color: ${props => props.theme.color.blue};
        box-shadow: 0 0 0 2px rgba(43, 108, 176, 0.5);
    }

    :not(select):read-only {
        background-color: ${props => props.theme.color.greyLightest};
    }
`;

InputSimple.displayName = "InputSimple";
