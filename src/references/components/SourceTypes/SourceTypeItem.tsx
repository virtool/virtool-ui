import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import { Trash } from "lucide-react";

interface SourceTypeItemProps {
    disabled?: boolean;
    sourceType: string;
    onRemove: (sourceType: string) => void;
}

export function SourceTypeItem({
    onRemove,
    sourceType,
    disabled = false,
}: SourceTypeItemProps) {
    return (
        <BoxGroupSection
            className="flex items-center capitalize"
            disabled={disabled}
        >
            <span className="mr-[5px]">{sourceType}</span>
            {disabled ? null : (
                <IconButton
                    className="ml-auto"
                    IconComponent={Trash}
                    color="red"
                    tip="remove"
                    onClick={() => onRemove(sourceType)}
                />
            )}
        </BoxGroupSection>
    );
}
