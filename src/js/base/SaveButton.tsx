import React from "react";
import { Button } from "./Button";

interface SaveButtonProps {
    altText?: string;
    disabled?: boolean;
}

export function SaveButton({
    altText = "Save",
    disabled = false,
}: SaveButtonProps) {
    return (
        <Button color="blue" disabled={disabled} type="submit">
            {altText}
        </Button>
    );
}

SaveButton.displayName = "SaveButton";
