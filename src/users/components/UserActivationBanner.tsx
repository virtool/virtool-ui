import Alert from "@base/Alert";
import Button from "@base/Button";
import { capitalize } from "es-toolkit";

type UserActivationBannerProps = {
    /** A callback function to activate or deactivate the user */
    onClick: () => void;

    /** Whether it is a deactivation or reactivation */
    verb: string;
};

/**
 * A styled banner for deactivating or reactivating a user
 */
export function UserActivationBanner({
    verb,
    onClick,
}: UserActivationBannerProps) {
    return (
        <Alert
            className="flex !items-center justify-between"
            color={verb === "deactivate" ? "red" : "green"}
        >
            <span>
                {verb === "deactivate"
                    ? "Disable access to the application for this user."
                    : "Restore access to Virtool for this user. Their account is currently deactivated."}
            </span>
            <Button
                color={verb === "deactivate" ? "red" : "green"}
                onClick={onClick}
            >
                {capitalize(verb)}
            </Button>
        </Alert>
    );
}
