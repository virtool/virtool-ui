import Alert from "./Alert";
import Button from "./Button";

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
