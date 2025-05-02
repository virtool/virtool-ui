import Button from "./Button";
import React from "react";

interface SaveButtonProps {
    altText?: string;
    disabled?: boolean;
}

export default function SaveButton({
    altText = "Save",
    disabled = false,
}: SaveButtonProps) {
    return (
        <Button color="blue" disabled={disabled} type="submit">
            {altText}
        </Button>
    );
}
