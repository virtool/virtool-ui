import React from "react";
import { Button } from "./index";

export const SaveButton = ({ altText, disabled }) => (
    <Button type="submit" color="blue" icon="save" disabled={disabled}>
        {altText || "Save"}
    </Button>
);
