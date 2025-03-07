import Button from "@base/Button";
import React from "react";

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
