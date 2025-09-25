import { getColor } from "@app/theme";
import React from "react";
import styled from "styled-components";

const ComboBoxItem = styled.li`
    padding: 10px 10px;

    &:hover {
        background-color: ${({ theme }) =>
            getColor({ color: "greyHover", theme })};
        border: 0;
    }
`;

ComboBoxItem.displayName = "ComboBoxItem";

export default function WrapRow(renderRow, getItemProps) {
    function WrappedRow(item, index) {
        return (
            <ComboBoxItem
                key={item.id}
                {...getItemProps({
                    item: item.id,
                    index,
                })}
            >
                {renderRow(item)}
            </ComboBoxItem>
        );
    }
    return WrappedRow;
}
