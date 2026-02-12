import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import { Trash } from "lucide-react";
import styled from "styled-components";

interface StyledSourceTypeItemProps {
    disabled: boolean;
}

const StyledSourceTypeItem = styled(BoxGroupSection)<StyledSourceTypeItemProps>`
    display: flex;
    justify-content: left;
    align-items: center;
    text-transform: capitalize;

    span:first-child {
        margin-right: 5px;
    }

    button.fas {
        margin-left: auto;
    }
`;

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
        <StyledSourceTypeItem disabled={disabled}>
            <span>{sourceType}</span>
            {disabled ? null : (
                <IconButton
                    IconComponent={Trash}
                    color="red"
                    tip="remove"
                    onClick={() => onRemove(sourceType)}
                />
            )}
        </StyledSourceTypeItem>
    );
}
