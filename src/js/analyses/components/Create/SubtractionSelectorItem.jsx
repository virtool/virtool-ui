import { SelectorItem } from "./SelectorItem";
import React, { useCallback } from "react";

export function SubtractionSelectorItem({ id, name, onClick, isDefault }) {
    const handleClick = useCallback(() => onClick(id), [id, onClick]);
    return (
        <SelectorItem onClick={handleClick} isDefault={isDefault}>
            {name}
        </SelectorItem>
    );
}
