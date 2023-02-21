import { ReactNode } from "react";
import styled, { DefaultTheme } from "styled-components";
import { Box } from "./Box";
import { Table } from "./Table";

type BoxGroupProps = {
    children: ReactNode;
    theme: DefaultTheme;
};

export const BoxGroup = styled(Box)<BoxGroupProps>`
    border-radius: ${props => props.theme.borderRadius.sm};
    padding: 0;
    position: relative;

    & > ${Table} {
        border: none;
        margin: 0;

        &:first-child {
            border-top: none;
        }

        tbody {
            border-top: none;
        }

        td,
        th {
            min-width: 0;
            padding: 8px 15px;
        }
    }
`;

BoxGroup.displayName = "BoxGroup";
