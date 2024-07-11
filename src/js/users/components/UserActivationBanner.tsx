import { Alert, Button } from "@base";
import React from "react";
import styled from "styled-components";

const ActivationBanner = styled(Alert)`
    align-items: center;
    justify-content: space-between;

    span:first-child {
        font-weight: ${props => props.theme.fontWeight.thick};

        strong {
            font-weight: ${props => props.theme.fontWeight.bold};
        }
    }
`;

type UserActivationBannerProps = {
    message: string;
    noun: string;
    buttonText: string;
    onClick: () => void;
};

export function UserActivationBanner({ buttonText, message, noun, onClick }: UserActivationBannerProps) {
    return (
        <ActivationBanner color={noun === "deactivate" ? "red" : "green"}>
            <div>
                <strong>{message}</strong>
                <div>
                    {noun === "deactivate"
                        ? "Deactivation temporarily disables a user's account, restricting access without deleting data."
                        : "Reactivation restores access to a previously deactivated account, allowing the user to regain full use of their account."}
                </div>
            </div>
            <Button
                color={noun === "deactivate" ? "red" : "green"}
                icon={noun === "deactivate" ? "times" : "check"}
                onClick={onClick}
            >
                {buttonText}
            </Button>
        </ActivationBanner>
    );
}
