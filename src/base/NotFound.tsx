import Label from "./Label";

type NotFoundProps = {
	status?: number;
	message?: string;
};

export default function NotFound({
	status = 404,
	message = "Not found",
}: NotFoundProps) {
	return (
		<div className="flex flex-col items-center justify-center h-96">
			<Label className="text-5xl" color="red">
				{status}
			</Label>
			<strong className="text-base pt-4">{message}</strong>
		</div>
	);
}
