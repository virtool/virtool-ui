import Alert from "./Alert";
import Button from "./Button";

type DeleteAlertProps = {
	buttonText: string;
	message: string;
	onClick: () => void;
	outerClassName?: string;
};

/**
 * An inline alert bar prompting a destructive action, paired with a button that
 * performs it.
 */
export default function DeleteAlert({
	buttonText,
	message,
	onClick,
	outerClassName,
}: DeleteAlertProps) {
	return (
		<Alert
			className="items-center justify-between"
			outerClassName={outerClassName}
			color="red"
		>
			<strong>{message}</strong>
			<Button color="red" onClick={onClick}>
				{buttonText}
			</Button>
		</Alert>
	);
}
