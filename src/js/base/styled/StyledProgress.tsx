import { get } from "lodash-es";
import styled, { DefaultTheme } from "styled-components/macro";

interface StyledProgressProps {
    color?: string;
    theme: DefaultTheme;
}

function getProgressColor({ color, theme }: StyledProgressProps) {
    return get(theme, ["color", color], theme.color.blue);
}

export const StyledProgress = styled.progress<StyledProgressProps>`
    background-color: ${props => props.theme.color.grey};
    border: 0;
    -webkit-appearance: none;
    height: 20px;
    margin-bottom: 10px;
    width: 100%;

    ::-webkit-progress-value {
        background-color: ${getProgressColor};
    }
    ::-moz-progress-bar {
        background-color: ${getProgressColor};
    }

    ::-webkit-progress-bar {
        background-color: ${props => props.theme.color.grey};
    }
`;
