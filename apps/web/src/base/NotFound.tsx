import { Empty, EmptyTitle } from "./Empty";
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
		<Empty className="h-96">
			<Label className="text-5xl" color="red">
				{status}
			</Label>
			<EmptyTitle>{message}</EmptyTitle>
		</Empty>
	);
}
