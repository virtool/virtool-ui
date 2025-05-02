import { borderRadius, getBorder, getColor, getFontWeight } from "../app/theme";
import * as RadixSelect from "@radix-ui/react-select";
import React from "react";
import styled from "styled-components";
import Icon from "./Icon";

const SelectTrigger = styled(RadixSelect.Trigger)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: ${({ theme }) => getColor({ color: "white", theme })};
    border: ${getBorder};
    border-radius: ${borderRadius.sm};
    font-weight: ${getFontWeight("thick")};
    text-transform: capitalize;

    i.fas {
        margin-left: 5px;
    }
`;

type SelectButtonProps = {
    placeholder?: string;
    icon?: string;
    className?: string;
    id?: string;
};

export default function SelectButton({
    placeholder,
    icon,
    className,
    id,
}: SelectButtonProps) {
    return (
        <SelectTrigger className={className} id={id}>
            <RadixSelect.Value placeholder={placeholder} />
            {icon ? <Icon name={icon} /> : null}
        </SelectTrigger>
    );
}
