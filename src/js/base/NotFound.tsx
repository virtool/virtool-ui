import React from "react";
import styled from "styled-components";
import { Label } from "./Label";

const StyledNotFound = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 400px;
    justify-content: center;

    strong {
        font-size: ${props => props.theme.fontSize.lg};
        padding-top: 15px;
    }
`;

type NotFoundProps = {
    status?: number;
    message?: string;
};

export function NotFound({ status = 404, message = "Not found" }: NotFoundProps) {
    return (
        <StyledNotFound>
            <Label className="text-3xl" color="red">
                {status}
            </Label>
            <strong>{message}</strong>
        </StyledNotFound>
    );
}
