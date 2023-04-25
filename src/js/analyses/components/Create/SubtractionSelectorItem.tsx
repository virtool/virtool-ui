import React, { useCallback } from "react";
import { SelectorItem } from "./SelectorItem";

interface SubtractionSelectorItemProps {
    id: string;
    isDefault: boolean;
    name: string;
    onClick: (id: string) => void;
}
export function SubtractionSelectorItem({ id, isDefault, name, onClick }: SubtractionSelectorItemProps) {
    const handleClick = useCallback(() => onClick(id), [id, onClick]);

    return (
        <SelectorItem onClick={handleClick} isDefault={isDefault}>
            {name}
        </SelectorItem>
    );
}
