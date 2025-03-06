import { Box, Button, Icon } from "@/base";
import React from "react";

export function NuvsBlastError({ error, onBlast }) {
    return (
        <Box className="flex items-center justify-between">
            <span>
                <strong>Error during BLAST request.</strong>
                <span> {error}</span>
            </span>
            <Button onClick={onBlast} color="blue">
                <Icon name="redo" /> Retry
            </Button>
        </Box>
    );
}
