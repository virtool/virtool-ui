import { Button } from "@/base";
import Alert from "@base/Alert";
import React from "react";
import styled from "styled-components";

const ActivationBanner = styled(Alert)`
    align-items: center;
    justify-content: space-between;

    span:first-child {
        font-weight: ${(props) => props.theme.fontWeight.thick};

        strong {
            font-weight: ${(props) => props.theme.fontWeight.bold};
        }
    }
`;

type UserActivationBannerProps = {
    /** Whether it is a deactivation or reactivation */
    noun: string;
    buttonText: string;
    /** A callback function to open respective dialog */
    onClick: () => void;
};

/**
 * A styled banner for deactivating or reactivating a user
 */
export function UserActivationBanner({
    buttonText,
    noun,
    onClick,
}: UserActivationBannerProps) {
    return (
        <ActivationBanner color={noun === "deactivate" ? "red" : "green"}>
            <div>
                <div>
                    {noun === "deactivate"
                        ? "Disable access to the application for this user."
                        : "Restore access to Virtool for this user. Their account is currently deactivated."}
                </div>
            </div>
            <Button
                color={noun === "deactivate" ? "red" : "green"}
                onClick={onClick}
            >
                {buttonText}
            </Button>
        </ActivationBanner>
    );
}
