import React from "react";
import { Button } from "./Button";

interface SaveButtonProps {
    altText?: string;
    disabled?: boolean;
}

export function SaveButton({ altText = "Save", disabled = false }: SaveButtonProps) {
    return (
        <Button type="submit" color="blue" icon="save" disabled={disabled}>
            {altText}
        </Button>
    );
}
