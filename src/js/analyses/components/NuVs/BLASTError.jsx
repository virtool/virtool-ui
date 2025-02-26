import React from "react";
import styled from "styled-components";
import { Box, Button, Icon } from "@base";

const StyledBLASTError = styled(Box)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 10px 10px 8px 10px;
    i.fas {
        margin-right: 5px;
    }
`;

export function BLASTError({ error, onBlast }) {
    return (
        <StyledBLASTError>
            <span>
                <strong>Error during BLAST request.</strong>
                <span> {error}</span>
            </span>
            <Button onClick={onBlast} color="blue">
                <Icon name="redo" /> Retry
            </Button>
        </StyledBLASTError>
    );
}
