import { BoxGroupSection } from "@base";
import { IconButton } from "@base/IconButton";
import { cn } from "@utils/utils";
import React from "react";

type SourceTypeItemProps = {
    disabled?: boolean;
    sourceType: string;
    onRemove: (sourceType: string) => void;
};

export function SourceTypeItem({ onRemove, sourceType, disabled = false }: SourceTypeItemProps) {
    return (
        <BoxGroupSection className={cn("flex", "items-center", "capitalize")} disabled={disabled}>
            <span>{sourceType}</span>
            {disabled ? null : (
                <IconButton
                    className={cn("ml-auto")}
                    name="trash"
                    color="red"
                    tip="remove"
                    onClick={() => onRemove(sourceType)}
                />
            )}
        </BoxGroupSection>
    );
}
