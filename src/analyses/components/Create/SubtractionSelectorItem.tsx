import { cn } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";
import Label from "@base/Label";
import React, { useCallback } from "react";

type SubtractionSelectorItemProps = {
    id: string;
    isDefault: boolean;
    name: string;
    onClick: (id: string) => void;
};

export default function SubtractionSelectorItem({
    id,
    isDefault,
    name,
    onClick,
}: SubtractionSelectorItemProps) {
    const handleClick = useCallback(() => onClick(id), [id, onClick]);

    return (
        <BoxGroupSection
            as="button"
            className={cn(
                "bg-white",
                "flex",
                "justify-between",
                "items-center",
                "select-none",
                "text-ellipsis",
                "text-nowrap",
            )}
            onClick={handleClick}
        >
            <span className="overflow-hidden">{name}</span>
            {isDefault ? <Label>Default</Label> : null}
        </BoxGroupSection>
    );
}
