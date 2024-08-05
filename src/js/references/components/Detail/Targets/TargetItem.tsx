import { IconButton } from "@base/IconButton";
import React, { useCallback } from "react";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../../app/theme";
import { BoxGroupSection } from "../../../../base";

const TargetItemHeader = styled.h3`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("md")};
    font-weight: ${getFontWeight("normal")};
    margin: 3px 0 6px;

    span {
        margin-left: auto;

        i:not(first-child) {
            margin-left: 3px;
        }
    }
`;

type TargetItemDescriptionProps = {
    description?: string;
};

const TargetItemDescription = styled.p<TargetItemDescriptionProps>`
    font-style: ${props => (props.description ? "normal" : "italic")};
    margin: 0;
`;

type TargetItemProps = {
    /** Whether the user has permission to modify the targets */
    canModify: boolean;
    /** The target description */
    description: string;
    /** The name of the target */
    name: string;
    /** A callback function to open dialog for editing the target */
    onEdit: (target: string) => void;
    /** A callback function to remove the target */
    onRemove: (target: string) => void;
};

/**
 * A condensed target item for use in a list of targets
 */
export function TargetItem({ canModify, description, name, onEdit, onRemove }: TargetItemProps) {
    const handleEdit = useCallback(() => onEdit(name), [name]);
    const handleRemove = useCallback(() => onRemove(name), [name]);

    return (
        <BoxGroupSection>
            <TargetItemHeader>
                {name}
                {canModify && (
                    <span>
                        <IconButton name="edit" color="orange" tip="modify" onClick={handleEdit} />
                        <IconButton name="trash" color="red" tip="remove" onClick={handleRemove} />
                    </span>
                )}
            </TargetItemHeader>
            <TargetItemDescription description={description}>{description || "No description"}</TargetItemDescription>
        </BoxGroupSection>
    );
}
