import styled, { DefaultTheme } from "styled-components";
import Alert from "./Alert";
import Button from "./Button";

interface StyledRemoveBannerProps {
    theme: DefaultTheme;
}

const StyledRemoveBanner = styled(Alert)<StyledRemoveBannerProps>`
    align-items: center;
    justify-content: space-between;

    span:first-child {
        font-weight: ${(props) => props.theme.fontWeight.thick};

        strong {
            font-weight: ${(props) => props.theme.fontWeight.bold};
        }
    }
`;

type RemoveBannerProps = {
    buttonText: string;
    message: string;
    onClick: () => void;
    outerClassName?: string;
};

export default function RemoveBanner({
    buttonText,
    message,
    onClick,
    outerClassName,
}: RemoveBannerProps) {
    return (
        <StyledRemoveBanner outerClassName={outerClassName} color="red">
            <strong>{message}</strong>
            <Button color="red" onClick={onClick}>
                {buttonText}
            </Button>
        </StyledRemoveBanner>
    );
}
